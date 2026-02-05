import Image from "next/image";
import LaoMap from "@/components/LaoMap";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-8 font-sans">
      <main className="w-full max-w-6xl text-center space-y-12">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
          Lao Map Project
        </h1>

        {/* Map Section */}
        <section className="w-full flex justify-center">
          <div className="w-full ">
            <LaoMap />
          </div>
        </section>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
            Lao Country Colors Configuration
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            The following colors have been configured in the Tailwind theme:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            {/* Red */}
            <div className="flex flex-col items-center gap-2">
              <div className="w-32 h-32 rounded-2xl shadow-lg bg-lao-red flex items-center justify-center text-white font-bold text-lg">
                lao-red
              </div>
              <span className="text-sm font-mono text-gray-500">#CE1126</span>
            </div>

            {/* Blue */}
            <div className="flex flex-col items-center gap-2">
              <div className="w-32 h-32 rounded-2xl shadow-lg bg-lao-blue flex items-center justify-center text-white font-bold text-lg">
                lao-blue
              </div>
              <span className="text-sm font-mono text-gray-500">#002868</span>
            </div>

            {/* White */}
            <div className="flex flex-col items-center gap-2">
              <div className="w-32 h-32 rounded-2xl shadow-lg bg-lao-white border border-gray-200 flex items-center justify-center text-gray-800 font-bold text-lg">
                lao-white
              </div>
              <span className="text-sm font-mono text-gray-500">#FFFFFF</span>
            </div>
          </div>
        </div>

        <div className="mt-12 p-6 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
          <p className="text-green-700 dark:text-green-400 font-semibold">
            Configuration Status: Success ✅
          </p>
        </div>
      </main>
    </div>
  );
}
