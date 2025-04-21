// src/components/GlobalToast.tsx
import React from 'react';
import { Toast } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../core/data/redux/store';
import { hideToast } from '../core/data/redux/toastSlice';

const GlobalToast: React.FC = () => {
  const dispatch = useDispatch();
  const { show, title, message, variant } = useSelector((state: RootState) => state.toast);
  console.log(show,title,message,variant);
  

  // Determine text color class
  const textColorClass = variant === 'light' ? 'text-dark' : 'text-white';

  return (
    <div className="toast-container position-fixed top-0 end-0 p-3" style={{ zIndex: 100000 }}>
      <Toast
        show={show}
        onClose={() => dispatch(hideToast())}
        delay={3000}
        autohide
        bg={variant}
        className={textColorClass}
      >
        <Toast.Header closeButton>
          <strong className="me-auto">{title || 'Notification'}</strong>
          <small>Just now</small>
        </Toast.Header>
        <Toast.Body>{message}</Toast.Body>
      </Toast>
    </div>
  );
};

export default GlobalToast;
