import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {

  return (
    <div>
      <section className="text-white py-20 bg-slate-500">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold mb-4">Welcome to MediMeet</h1>
          <p className="text-xl mb-8">Your Health, Our Priority</p>

          <Button variant={"default"}>
            <Link
              href={"/search"}
              className="px-6 py-3 rounded-md text-lg font-semibold"
            >
              Book an Appointment
            </Link>
          </Button>
        </div>
      </section>
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800">Why Choose Us?</h2>
            <p className="text-gray-600 mt-4">
              We provide the best healthcare services with the latest technology
              and experienced professionals.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <i className="fas fa-user-md text-blue-500 text-4xl mb-4"></i>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Experienced Doctors
              </h3>
              <p className="text-gray-600">
                Our team consists of highly experienced and specialized doctors.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <i className="fas fa-hospital text-blue-500 text-4xl mb-4"></i>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Modern Facilities
              </h3>
              <p className="text-gray-600">
                We are equipped with state-of-the-art medical facilities.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
              <i className="fas fa-heartbeat text-blue-500 text-4xl mb-4"></i>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Personalized Care
              </h3>
              <p className="text-gray-600">
                We provide personalized care tailored to your individual needs.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
