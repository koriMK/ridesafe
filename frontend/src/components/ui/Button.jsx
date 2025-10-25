export const Button = ({ children, variant = 'primary', size = 'default', className = '', ...props }) => {
  const getStyles = () => {
    let base = {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 'var(--radius-md)',
      fontWeight: '600',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      border: 'none',
      cursor: 'pointer',
      textDecoration: 'none',
      position: 'relative',
      overflow: 'hidden',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
      transform: 'translateY(0)',
      letterSpacing: '0.025em'
    };

    if (variant === 'primary') {
      base.background = 'linear-gradient(135deg, var(--primary) 0%, #2563eb 100%)';
      base.color = 'var(--primary-foreground)';
      base.boxShadow = '0 4px 14px 0 rgba(59, 130, 246, 0.25)';
    }
    if (variant === 'secondary') {
      base.background = 'var(--gray-100)';
      base.color = 'var(--gray-900)';
      base.border = '1px solid var(--border)';
      base.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1)';
    }
    if (variant === 'ghost') {
      base.background = 'transparent';
      base.color = 'var(--gray-700)';
      base.boxShadow = 'none';
    }
    if (variant === 'destructive') {
      base.background = 'linear-gradient(135deg, var(--danger) 0%, #dc2626 100%)';
      base.color = 'white';
      base.boxShadow = '0 4px 14px 0 rgba(239, 68, 68, 0.25)';
    }

    if (size === 'sm') {
      base.height = '2.25rem';
      base.padding = '0 1rem';
      base.fontSize = '0.875rem';
    }
    if (size === 'default') {
      base.height = '2.75rem';
      base.padding = '0 1.5rem';
      base.fontSize = '0.875rem';
    }
    if (size === 'lg') {
      base.height = '3rem';
      base.padding = '0 2rem';
      base.fontSize = '1rem';
    }

    if (props.disabled) {
      base.opacity = '0.6';
      base.cursor = 'not-allowed';
      base.transform = 'none';
      base.boxShadow = 'none';
    }

    return base;
  };

  const handleMouseEnter = (e) => {
    if (!props.disabled) {
      e.target.style.transform = 'translateY(-1px)';
      if (variant === 'primary') {
        e.target.style.boxShadow = '0 8px 25px 0 rgba(59, 130, 246, 0.35)';
      } else if (variant === 'secondary') {
        e.target.style.boxShadow = '0 4px 12px 0 rgba(0, 0, 0, 0.15)';
      } else if (variant === 'destructive') {
        e.target.style.boxShadow = '0 8px 25px 0 rgba(239, 68, 68, 0.35)';
      }
    }
  };

  const handleMouseLeave = (e) => {
    if (!props.disabled) {
      e.target.style.transform = 'translateY(0)';
      const styles = getStyles();
      e.target.style.boxShadow = styles.boxShadow;
    }
  };

  return (
    <button 
      style={getStyles()} 
      className={className} 
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {children}
    </button>
  );
};