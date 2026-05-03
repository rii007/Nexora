function GradientButton({ loading, loadingText = 'Processing...', children, ...props }) {
  return (
    <button
      {...props}
      className="inline-flex w-full items-center justify-center rounded-lg bg-indigo-600 px-4 py-3.5 text-sm font-semibold text-white transition-all duration-200 hover:scale-[1.02] hover:bg-indigo-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-75 disabled:hover:scale-100"
    >
      {loading ? (
        <span className="inline-flex items-center gap-2">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          {loadingText}
        </span>
      ) : (
        children
      )}
    </button>
  )
}

export default GradientButton
