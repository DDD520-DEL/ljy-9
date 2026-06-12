interface PixelButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'cyan' | 'pink';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit';
}

const PixelButton = ({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  disabled = false,
  className = '',
  type = 'button',
}: PixelButtonProps) => {
  const variantClasses = {
    primary: 'pixel-btn-primary',
    cyan: 'pixel-btn-cyan',
    pink: 'pixel-btn-pink',
  };

  const sizeClasses = {
    sm: 'text-xs py-2 px-4',
    md: 'text-xs py-3 px-6',
    lg: 'text-sm py-4 px-8',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`pixel-btn ${variantClasses[variant]} ${sizeClasses[size]} ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      } ${className}`}
    >
      {children}
    </button>
  );
};

export default PixelButton;
