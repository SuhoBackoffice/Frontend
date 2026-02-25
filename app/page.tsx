import { Separator } from '@/components/ui/separator';
import MainPageStatCards from './_components/MainPageStatCardsComponent';
import MainPageOnGoingProject from './_components/MainPageOnGoingProjectComponent';

export default function Home() {
  return (
    <div className="container mx-auto py-8">
      <MainPageStatCards />
      <Separator className="my-8" />
      <MainPageOnGoingProject />
    </div>
  );
}
