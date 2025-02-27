import React from "react";

//@ts-ignore
function Modal({ isOpen, onClose, title, content, actions }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
        {title && <h3 className="text-lg font-bold mb-4">{title}</h3>}
        {content && <p className="text-gray-700 mb-4">{content}</p>}
        <div className="flex justify-end gap-2">{actions}</div>
      </div>
    </div>
  );
}

export default Modal;
