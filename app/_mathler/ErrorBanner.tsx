type ErrorBannerProps = {
  message: string;
  onClose: () => void;
  errorTransitionState: 'out' | 'in' | null;
};

function ErrorBanner({
  message,
  onClose,
  errorTransitionState,
}: ErrorBannerProps) {
  let animationClassName = null;
  if (errorTransitionState === 'in') {
    animationClassName = 'animate-scale-in-center';
  }
  if (errorTransitionState === 'out') {
    animationClassName = 'animate-scale-out-center';
  }
  return (
    <div
      className={`flex flex-col prose prose-sm md:prose-base alert alert-error prose-p:mt-0 gap-0 scale-0 ${animationClassName}`}
    >
      <div className="w-full flex flex-row-reverse">
        <button
          type="button"
          className="btn btn-circle btn-outline btn-xs"
          onClick={onClose}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
      <p>{message}</p>
    </div>
  );
}

export default ErrorBanner;
