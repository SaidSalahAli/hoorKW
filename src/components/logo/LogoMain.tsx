import Image from 'next/image';

// ==============================|| LOGO MAIN ||============================== //

export default function LogoMain({ reverse }: { reverse?: boolean }) {
  return (
    <Image src="/assets/images/logo.png" alt="icon logo" width={100} height={35} style={{ height: 'auto' }} />
  );
}
