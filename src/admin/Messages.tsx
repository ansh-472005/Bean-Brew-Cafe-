import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { ContactMessage } from '../types';
import { Trash2, Mail, User, Calendar, MessageSquare } from 'lucide-react';

const Messages = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'messages'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      setMessages(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as ContactMessage)));
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Delete this message?")) {
      await deleteDoc(doc(db, 'messages', id));
      fetchMessages();
    }
  };

  if (loading) return <div className="animate-pulse h-96 bg-white rounded-3xl"></div>;

  return (
    <div className="space-y-10">
      <header>
        <h1 className="text-4xl font-serif font-bold mb-2">Customer Messages</h1>
        <p className="text-cafe-dark/40">View and manage inquiries from your contact form.</p>
      </header>

      <div className="grid grid-cols-1 gap-6">
        {messages.map((msg) => (
          <div key={msg.id} className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-cafe-brown/5 relative group">
            <button 
              onClick={() => handleDelete(msg.id)}
              className="absolute top-8 right-8 p-2 text-cafe-dark/20 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
            >
              <Trash2 className="h-5 w-5" />
            </button>

            <div className="flex flex-col md:flex-row md:items-center gap-6 mb-8 pb-6 border-b border-cafe-brown/5">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-2xl bg-cafe-cream flex items-center justify-center text-cafe-gold">
                  <User className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold">{msg.name}</h3>
                  <div className="flex items-center space-x-2 text-xs text-cafe-dark/40">
                    <Mail className="h-3 w-3" />
                    <span>{msg.email}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-4 md:ml-auto">
                <div className="flex items-center space-x-2 text-xs text-cafe-dark/40 bg-cafe-cream px-4 py-2 rounded-full">
                  <Calendar className="h-3 w-3" />
                  <span>{msg.createdAt?.toDate().toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-cafe-gold">
                <MessageSquare className="h-4 w-4" />
                <h4 className="font-bold text-sm uppercase tracking-widest">{msg.subject}</h4>
              </div>
              <p className="text-cafe-dark/70 leading-relaxed whitespace-pre-wrap">{msg.message}</p>
            </div>
          </div>
        ))}

        {messages.length === 0 && (
          <div className="text-center py-24 bg-white rounded-[3rem] border border-dashed border-cafe-brown/20">
            <MessageSquare className="h-12 w-12 text-cafe-gold/20 mx-auto mb-4" />
            <p className="text-cafe-dark/40 font-serif text-xl">No messages yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;
