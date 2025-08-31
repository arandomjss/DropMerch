export default function Hero() {
  return (
    <section className="w-full min-h-[60vh] bg-gradient-to-br from-genzPink via-genzPurple to-genzBlue flex flex-col justify-center items-center text-white px-0 py-16">
      <h1 className="text-4xl md:text-6xl font-extrabold mb-6 text-center drop-shadow-lg">
        DropMerch: Campus Merch Drops, Gen Z Style
      </h1>
      <p className="text-lg md:text-2xl mb-8 text-center max-w-2xl">
        Discover, create, and shop the freshest campus-inspired merch. Powered by students, for students.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <a href="/shop" className="bg-white text-genzPurple font-bold py-3 px-8 rounded-full shadow-md hover:scale-105 transition text-lg">
          Shop The Drop
        </a>
        <a href="#ideas" className="bg-black/30 text-white font-bold py-3 px-8 rounded-full shadow-md hover:scale-105 transition text-lg">
          Create Your Own
        </a>
      </div>
    </section>
  );
}