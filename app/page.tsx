export default function Page() {
  return (
    <main className="min-h-screen flex flex-col">
      <div className="h-1/2 flex flex-col items-center justify-center">
        <img src="/logo.png" alt="logo" className="w-20 h-auto" />
        {/* <h1 className="text-[5vw] font-semibold">Coming Soon</h1> */}
      </div>
      {/* <div className="h-2/3 w-full">
        <video
          src="/boudha.mp4"
          autoPlay={true}
          muted
          className="w-full h-full object-cover"
        />
      </div> */}
    </main>
  );
}
