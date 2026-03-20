
export const Button = ({
  children,
  variant = "primary",
  size = "md",
  loading,
  disabled,
  icon,
  ...props
}) => {
  const variants = {
    primary: "bg-blue-500 text-white",
    secondary: "bg-gray-500 text-white",
    danger: "bg-red-500 text-white",
    ghost: "bg-transparent text-black",
  };

  const sizes = {
    sm: "px-2 py-1 text-sm",
    md: "px-4 py-2",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <button
      className={`flex items-center gap-2 rounded ${variants[variant]} ${sizes[size]} ${disabled ? "opacity-50" : ""}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? "Loading..." : (
        <>
          {icon && <span>{icon}</span>}
          {children}
        </>
      )}
    </button>
  );
};