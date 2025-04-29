import Layout from "@/components/layout/Layout";
import { Users, School, Calendar } from "lucide-react";

const AboutPage = () => {
  return (
    <Layout>
      <div className="bg-clubhub-gray-light min-h-screen py-12">
        <div className="container mx-auto px-6">
          {/* Title */}
          <h1 className="text-4xl font-bold mb-8 text-clubhub-gray-dark text-center">
            About IIITA ClubHub
          </h1>

          {/* Project By Section */}
          <section className="mt-12 pt-8 border-t border-gray-200">
            <div className="bg-white p-10 rounded-xl shadow-xl">
              <h2 className="text-3xl font-extrabold mb-10 text-center text-clubhub-blue underline underline-offset-4">
                Project by
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 text-center">
                {[
                  { name: "Karthikeyan", roll: "IIT2023245" },
                  { name: "Chada Varshith", roll: "IIB2023043" },
                  { name: "Teja Vardhan", roll: "IIT2023272" },
                  { name: "Pavan Kumar", roll: "IIT2023226" },
                  { name: "Ujwala", roll: "IIT2023244" },
                ].map((person, idx) => (
                  <div
                    key={idx}
                    className="bg-clubhub-gray-light p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 ease-in-out"
                  >
                    <p className="text-xl font-semibold text-clubhub-gray-dark">
                      {person.name}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">{person.roll}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Mission & Features Section */}
          <section className="py-12 px-4">
            <div className="container mx-auto max-w-4xl">
              <div className="text-center mb-10">
                <p className="text-lg text-gray-600">
                  A platform designed to enhance student engagement and club management at IIITA
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {/* Mission */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <div className="flex items-center mb-4">
                    <School className="w-6 h-6 text-primary mr-2" />
                    <h3 className="text-xl font-semibold">Our Mission</h3>
                  </div>
                  <p className="text-gray-600">
                    To streamline club activities and foster a more connected student community at IIITA
                    through an intuitive digital platform.
                  </p>
                </div>

                {/* Features */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <div className="flex items-center mb-4">
                    <Calendar className="w-6 h-6 text-primary mr-2" />
                    <h3 className="text-xl font-semibold">Key Features</h3>
                  </div>
                  <ul className="text-gray-600 space-y-2">
                    <li>• Seamless club management</li>
                    <li>• Event organization and tracking</li>
                    <li>• Student participation analytics</li>
                    <li>• Real-time notifications</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Contact Us Section */}
          <section className="bg-white rounded-lg shadow-md p-8 mt-8">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl font-semibold mb-6 text-clubhub-blue">Contact Us</h2>
              <p className="text-gray-600 mb-6">
                Have questions or suggestions about IIITA ClubHub? We'd love to hear from you!
              </p>
              <p className="text-gray-600">
                <strong>Email:</strong> clubhub@iiita.ac.in<br />
                <strong>Location:</strong> Student Activity Center, IIITA Campus
              </p>
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default AboutPage;
