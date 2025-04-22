import { Button } from "@/components/ui/button";
import { featuredItems, programs } from "@/constants";
import men from "@/assets/men.webp";
import { Card } from "@/components/ui/card";
import { FaArrowRightLong } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import { useUserState } from "@/stores/user.store";
import { CgGym } from "react-icons/cg";
import { LogOut } from "lucide-react";
import { auth } from "@/firebase";
import { Helmet } from "react-helmet-async";

const Home = () => {
  const { user, setUser } = useUserState();
  const navigate = useNavigate();

  const onLogout = () => {
    auth.signOut().then(() => {
      setUser(null);
      navigate("/auth");
    });
  };

  return (
    <>
      <Helmet>
        <title>Gym Training - Build Your Best Body</title>
        <meta
          name="description"
          content="Professional gym training programs for all levels. Get fit, build muscle, and live healthy."
        />
        <meta name="keywords" content="gym, training, workout, fitness, bodybuilding, health" />
        <meta name="author" content="Dilyorbek" />

        {/* Open Graph tags for social media */}
        <meta property="og:title" content="Gym Training" />
        <meta
          property="og:description"
          content="Transform your body with expert gym training. Start your fitness journey today."
        />
        <meta property="og:image" content="https://gym-jade-two.vercel.app/favicon.png" />
        <meta property="og:url" content="https://gym-jade-two.vercel.app/" />
        <meta property="og:type" content="website" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Gym Training - Transform Your Body" />
        <meta
          name="twitter:description"
          content="Join our professional gym training programs and get the results you want."
        />
        <meta name="twitter:image" content="https://gym-jade-two.vercel.app/favicon.png" />
      </Helmet>
      {/* Hero Section */}
      <div className="w-full mt-20 min-h-screen flex flex-col gap-10 lg:flex-row items-center justify-center px-4 sm:px-6 md:px-8 py-8 lg:py-0">
        <div className="w-full lg:w-1/2 flex flex-col justify-center lg:pl-6 xl:pl-12 2xl:pl-24 order-2 lg:order-1 mt-8 lg:mt-0 ">
          <h1 className="min-md:text-9xl max-md:text-6xl font-semibold uppercase">
            Workout with me
          </h1>
          <p className="text-muted-foreground mt-4 max-w-lg">
            A huge selection of health and fitness content, healthy recipes and
            transformation stories to help you get fit and stay fit!
          </p>
          {user ? (
            <div className="flex flex-wrap gap-4 mt-6">
              <Link to={"/dashboard"}>
                <Button aria-label="Go to Gym" className="w-fit font-bold h-12">
                  <span>Go to GYM</span>
                  <CgGym className="w-5 h-5 ml-2"></CgGym>
                </Button>
              </Link>
              <Button
              aria-label="Logout"
                onClick={onLogout}
                variant={"destructive"}
                className="w-fit font-bold h-12"
              >
                <span>Logout</span>
                <LogOut className="w-5 h-5 ml-2"></LogOut>
              </Button>
            </div>
          ) : (
            <Link to={"/auth"} className="cursor-default">
              <Button aria-label="Join club now" className="w-fit mt-6 font-bold h-12" size={"lg"}>
                Join club now
              </Button>
            </Link>
          )}

          <div className="mt-12 md:mt-16 lg:mt-24">
            <p className="text-muted-foreground">AS FEATURED IN</p>
            <div className="flex flex-wrap items-center gap-4 mt-2">
              {featuredItems.map((Icon, index) => (
                <Icon
                  key={index}
                  className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12"
                />
              ))}
            </div>
          </div>
        </div>
        <div className="w-full lg:w-1/3 flex justify-center order-1 lg:order-2">
          <img
            src={men}
            alt="Fitness Model"
            loading="lazy"
            className="w-1/2 sm:w-2/5 md:w-1/3 lg:w-4/5 object-contain"
            width={500}
            height={600}
          />
        </div>
      </div>

      {/* Programs Section */}
      <div className="container mx-auto px-4 sm:px-6 md:px-8 py-12 lg:py-16">
        <h1 className="text-3xl md:text-4xl">Not sure where to start?</h1>
        <p className="mt-2 text-muted-foreground">
          Programs offer day-to-day guidance on an interactive calendar to keep
          you on track
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 my-8">
          {programs.map((item) => (
            <Card
              key={item.title}
              className="p-6 md:p-8 relative cursor-pointer group"
            >
              <h1>{item.title}</h1>
              <p className="text-sm text-muted-foreground ">{item.descr}</p>
              <Button
              aria-label="right icon"
                size={"icon"}
                variant={"ghost"}
                className="absolute right-2 top-1/2 group-hover:translate-x-1 transition-transform"
              >
                <FaArrowRightLong />
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
};

export default Home;
