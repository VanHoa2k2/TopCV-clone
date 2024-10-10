import BgAuth from "./_component/BgAuth";
import HeaderContent from "./_component/HeaderContent";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex justify-between">
      <div className="flex justify-center mt-[60px] w-full">
        <div className="w-[600px]">
          <HeaderContent />
          {children}
          <div className="mt-3 border-t border-solid border-[#eee] text-center p-4 text-[#4d5965] text-sm">
            <p className="text-sm leading-[145%] text-center mt-[30px] text-primary">
              © 2016. All Rights Reserved. TopCV Vietnam JSC.
            </p>
          </div>
        </div>
      </div>
      <div className="min-w-[500px]"></div>
      <BgAuth />
    </div>
  );
}
