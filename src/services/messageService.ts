import { supabase } from '../lib/supabase';
import { Message, Conversation } from '../types';

export const sendMessage = async (senderId: string, recipientId: string, content: string, serviceId?: string, isLead: boolean = false) => {
  try {
    console.log(`Sending message from ${senderId} to ${recipientId}`);
    
    // Ensure we're using the full UUID, not just a part of it
    const { data, error } = await supabase
      .from('messages')
      .insert({
        sender_id: senderId,
        recipient_id: recipientId,
        content,
        service_id: serviceId,
        is_lead: isLead,
        lead_status: isLead ? 'direct' : null,
        created_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) {
      console.error("Error sending message:", error);
      throw error;
    }
    
    console.log("Message sent successfully:", data);
    return data;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

export const fetchConversations = async (userId: string) => {
  try {
    console.log("Fetching conversations for user:", userId);
    
    // Get the latest message from each conversation
    const { data: sentMessages, error: sentError } = await supabase
      .from('messages')
      .select(`
        id,
        content,
        created_at,
        read,
        is_lead,
        lead_status,
        recipient:recipient_id (
          id,
          full_name,
          avatar_url
        )
      `)
      .eq('sender_id', userId)
      .order('created_at', { ascending: false });
    
    if (sentError) {
      console.error("Error fetching sent messages:", sentError);
      throw sentError;
    }
    
    const { data: receivedMessages, error: receivedError } = await supabase
      .from('messages')
      .select(`
        id,
        content,
        created_at,
        read,
        is_lead,
        lead_status,
        sender:sender_id (
          id,
          full_name,
          avatar_url
        )
      `)
      .eq('recipient_id', userId)
      .order('created_at', { ascending: false });
    
    if (receivedError) {
      console.error("Error fetching received messages:", receivedError);
      throw receivedError;
    }
    
    console.log("Sent messages:", sentMessages);
    console.log("Received messages:", receivedMessages);
    
    // Combine and process the messages to get unique conversations
    const conversationsMap = new Map<string, Conversation>();
    
    // Process sent messages
    sentMessages?.forEach(message => {
      const otherUserId = message.recipient.id;
      
      if (!conversationsMap.has(otherUserId)) {
        conversationsMap.set(otherUserId, {
          userId: otherUserId,
          userName: message.recipient.full_name,
          userAvatar: message.recipient.avatar_url,
          lastMessage: message.content,
          lastMessageDate: message.created_at,
          unreadCount: 0
        });
      }
    });
    
    // Process received messages
    receivedMessages?.forEach(message => {
      const otherUserId = message.sender.id;
      
      if (!conversationsMap.has(otherUserId)) {
        conversationsMap.set(otherUserId, {
          userId: otherUserId,
          userName: message.sender.full_name,
          userAvatar: message.sender.avatar_url,
          lastMessage: message.content,
          lastMessageDate: message.created_at,
          unreadCount: message.read ? 0 : 1
        });
      } else {
        // Update unread count if this is a more recent message
        const existing = conversationsMap.get(otherUserId)!;
        if (!message.read && new Date(message.created_at) > new Date(existing.lastMessageDate || '')) {
          existing.unreadCount += 1;
          existing.lastMessage = message.content;
          existing.lastMessageDate = message.created_at;
          conversationsMap.set(otherUserId, existing);
        }
      }
    });
    
    // Convert map to array and sort by most recent message
    const conversations = Array.from(conversationsMap.values())
      .sort((a, b) => {
        const dateA = a.lastMessageDate ? new Date(a.lastMessageDate).getTime() : 0;
        const dateB = b.lastMessageDate ? new Date(b.lastMessageDate).getTime() : 0;
        return dateB - dateA;
      });
    
    console.log("Processed conversations:", conversations);
    return conversations;
  } catch (error) {
    console.error('Error fetching conversations:', error);
    throw error;
  }
};

export const fetchMessages = async (userId: string, otherUserId: string) => {
  try {
    console.log(`Fetching messages between ${userId} and ${otherUserId}`);
    
    // Make sure we're using the full UUIDs
    const { data, error } = await supabase
      .from('messages')
      .select(`
        id,
        sender_id,
        recipient_id,
        content,
        read,
        is_lead,
        lead_status,
        service_id,
        created_at,
        sender:sender_id (
          full_name,
          avatar_url
        ),
        recipient:recipient_id (
          full_name,
          avatar_url
        )
      `)
      .or(`and(sender_id.eq.${userId},recipient_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},recipient_id.eq.${userId})`)
      .order('created_at', { ascending: true });
    
    if (error) {
      console.error("Error fetching messages:", error);
      throw error;
    }
    
    console.log("Messages data:", data);
    
    // Transform the data to match the Message type
    const messages: Message[] = data.map(item => ({
      id: item.id,
      senderId: item.sender_id,
      senderName: item.sender.full_name,
      senderAvatar: item.sender.avatar_url,
      recipientId: item.recipient_id,
      recipientName: item.recipient.full_name,
      recipientAvatar: item.recipient.avatar_url,
      content: item.content,
      read: item.read,
      isLead: item.is_lead,
      leadStatus: item.lead_status,
      serviceId: item.service_id,
      createdAt: item.created_at
    }));
    
    // Mark unread messages as read
    const unreadMessageIds = data
      .filter(message => message.recipient_id === userId && !message.read)
      .map(message => message.id);
    
    if (unreadMessageIds.length > 0) {
      console.log("Marking messages as read:", unreadMessageIds);
      
      await supabase
        .from('messages')
        .update({ read: true })
        .in('id', unreadMessageIds);
    }
    
    return messages;
  } catch (error) {
    console.error('Error fetching messages:', error);
    throw error;
  }
};

export const markMessageAsRead = async (messageId: string) => {
  try {
    const { error } = await supabase
      .from('messages')
      .update({ read: true })
      .eq('id', messageId);
    
    if (error) {
      console.error("Error marking message as read:", error);
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Error marking message as read:', error);
    throw error;
  }
};

export const getUnreadMessageCount = async (userId: string) => {
  try {
    const { count, error } = await supabase
      .from('messages')
      .select('id', { count: 'exact', head: true })
      .eq('recipient_id', userId)
      .eq('read', false);
    
    if (error) {
      console.error("Error getting unread message count:", error);
      throw error;
    }
    
    return count || 0;
  } catch (error) {
    console.error('Error getting unread message count:', error);
    throw error;
  }
};

// Check for expired leads and convert them to opportunity leads
export const checkAndUpdateExpiredLeads = async () => {
  try {
    const threeHoursAgo = new Date();
    threeHoursAgo.setHours(threeHoursAgo.getHours() - 3);
    
    // Find all direct leads that are older than 3 hours and haven't been responded to
    const { data, error } = await supabase
      .from('messages')
      .select('id')
      .eq('is_lead', true)
      .eq('lead_status', 'direct')
      .lt('created_at', threeHoursAgo.toISOString());
    
    if (error) {
      throw error;
    }
    
    if (data && data.length > 0) {
      const messageIds = data.map(msg => msg.id);
      
      // Update these leads to opportunity leads
      await supabase
        .from('messages')
        .update({ lead_status: 'opportunity' })
        .in('id', messageIds);
    }
    
    return true;
  } catch (error) {
    console.error('Error updating expired leads:', error);
    throw error;
  }
};