const Banner = () => {
  return (
    <a href="https://ai.fine.dev" target="_blank" rel="noopener noreferrer">
      <div className="flex px-2 border border-1 w-44 rounded-lg items-center justify-center bg-purple-700 text-white text-sm p-2 fixed right-5 bottom-5">
        Made with
        <img
          src="https://ai.fine.dev/images/favicon.svg"
          className="w-5 h-5 pb-1 mx-1"
          alt="Fine logo"
        />
        <p className="font-semibold">Fine</p>
      </div>
    </a>
  );
};

export default Banner;
