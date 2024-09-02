import Image from "next/image";

export const Hero = () => {
  return (
    <div
      className="flex flex-col items-center justify-center max-w-5xl"
      data-testid="hero"
    >
      <div className="flex items-center">
        <div className="relative w-[300px] h-[450px] sm:w-[350px] sm:h-[525px] md:w-[400px] md:h-[600px]">
          <Image
            src="/documents.png"
            fill
            alt="Documents"
            sizes="400px"
            className="object-contain"
          />
        </div>
        <div className="relative w-[400px] h-[600px] hidden md:block">
          <Image
            src="/reading.png"
            fill
            alt="Reading"
            sizes="400px"
            className="w-full h-auto object-contain"
          />
        </div>
      </div>
    </div>
  );
};
