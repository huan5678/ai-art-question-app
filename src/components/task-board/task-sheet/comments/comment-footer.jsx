'use client';
import React, { useState } from 'react';
import { SendHorizontal } from 'lucide-react';

import { postCommentAction } from '@/action/project-action';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';
import avatar from '@/public/images/avatar/avatar-7.jpg';
const CommentFooter = ({ taskId }) => {
  const [message, setMessage] = useState('');
  const handleChange = (e) => {
    setMessage(e.target.value);
    e.target.style.height = 'auto'; // Reset the height to auto to adjust
    e.target.style.height = `${e.target.scrollHeight - 15}px`;
  };

  const handleSelectEmoji = (emoji) => {
    setMessage(message + emoji.native);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newMessage = {
      name: 'CodeShaper',
      avatar: avatar,
      text: message,
      date: formatDate(new Date()),
      subTaskId: taskId,
    };

    try {
      await postCommentAction(newMessage);
      setMessage('');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="flex w-full items-end gap-4 px-4">
        <div className="flex-1">
          <form onSubmit={handleSubmit}>
            <div className="relative  flex gap-1">
              <textarea
                value={message}
                placeholder="Type your message..."
                className="bg-default-100 h-10 flex-1 break-words rounded-xl p-1 px-3 pt-2 "
                onChange={handleChange}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
                style={{
                  minHeight: '40px',
                  maxHeight: '120px',
                  overflowY: 'auto',
                  resize: 'none',
                }}
              />

              <Button
                type="submit"
                className="bg-default-100 hover:bg-default-100 size-[42px] self-end rounded-full p-0"
              >
                <SendHorizontal className="text-primary h-8 w-5" />
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default CommentFooter;
