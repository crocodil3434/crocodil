import { useState, useEffect } from 'react'; // Import useState and useEffect hooks from React

const useDraggable = (handle, modal) => {
    const [isDragging, setIsDragging] = useState(false);
  
    useEffect(() => {
      const handleElement = handle.current;
      const modalElement = modal.current;
  
      if (!handleElement || !modalElement) {
        console.error("Handle or modal element is not available");
        return;
      }
  
      const handleMouseDown = (event) => {
        setIsDragging(true);
        event.preventDefault(); // Prevent browser default action
      };
  
      const handleMouseMove = (event) => {
        if (isDragging) {
          const newX = event.clientX - modalElement.offsetWidth / 2;
          const newY = event.clientY - modalElement.offsetHeight / 2;
          modalElement.style.left = `${newX}px`;
          modalElement.style.top = `${newY}px`;
        }
      };
  
      const handleMouseUp = () => {
        setIsDragging(false);
      };
  
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      handleElement.addEventListener('mousedown', handleMouseDown);
  
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        handleElement.removeEventListener('mousedown', handleMouseDown);
      };
    }, [isDragging]); // Dependency array includes isDragging to re-run the effect when it changes
  
    return null;
};
export default useDraggable; // Default export
