

import React from 'react'

const HomePage = () => {
  return (
    <>
    <header className="bg-white shadow">
        <nav className="container mx-auto px-6 py-3">
            <div className="flex justify-between items-center">
                <div className="text-lg font-semibold text-gray-700">PointLab</div>
                <div className="space-x-4 text-gray-600 hidden md:flex">
                    <a href="#" className="hover:text-blue-600">Home</a>
                    <a href="#" className="hover:text-blue-600">About Us</a>
                    <a href="#" className="hover:text-blue-600">Services</a>
                    <a href="#" className="hover:text-blue-600">Testimonial</a>
                    <a href="#" className="hover:text-blue-600">Contact Us</a>
                    <a href="#" className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">Start Now</a>
                </div>
            </div>
        </nav>
    </header>

    <main>
        <section className="container mx-auto px-6 py-12">
            <h2 className="text-4xl font-bold text-center text-gray-800 mb-8">About Us</h2>
            <p className="text-gray-600 text-center mb-12">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.</p>
            <div className="flex flex-wrap -mx-4">
                <div className="w-full lg:w-1/2 px-4">
                    <h3 className="text-3xl font-bold text-gray-800 mb-8">We Employ Latest Research Technology & Company</h3>
                    <p className="text-gray-600 mb-8">Urna congue faucibus rhoncus a ultrices nec at pulvinar convallis ac vitae amet condimentum risus pharetra rhoncus pretium consequat cras feugiat lorem nam non.</p>
                    <p className="text-gray-600 mb-8">Pulvinar proin sit neque pellentesque elementum purus faucibus nunc tincidunt lorem sed posuere velit condimentum sem scelerisque varius tempor in amet curabitur malesuada nisl, urna congue feugiat hendrerit ac urna pharetra volutpat semper, arcu amet condimentum risus pharetra rhoncus pretium consequat cras feugiat lorem nam non.</p>
                </div>
                <div className="w-full lg:w-1/2 px-4 flex items-center justify-center">
                    <img className="rounded-lg shadow-lg" src="https://placehold.co/600x400" alt="Researcher holding a petri dish with samples" />
                </div>
            </div>
        </section>

        <section className="bg-white py-8">
            <div className="container mx-auto px-6 flex items-center flex-wrap">
                <div className="w-full md:w-1/3 text-center p-4">
                    <span className="text-5xl text-blue-600 font-bold">400+</span>
                    <p className="text-gray-600 mt-2">Complete Cases</p>
                </div>
                <div className="w-full md:w-1/3 text-center p-4">
                    <span className="text-5xl text-blue-600 font-bold">20</span>
                    <p className="text-gray-600 mt-2">Expert Staff</p>
                </div>
                <div className="w-full md:w-1/3 text-center p-4">
                </div>
            </div>
        </section>

        <section className="container mx-auto px-6 py-12">
            <h2 className="text-4xl font-bold text-center text-gray-800 mb-8">Why Choose Us</h2>
            <p className="text-gray-600 text-center mb-12">Imperdiet aliquet est vel nulla turpis eu consequat ullamcorper a egestas suspendisse faucibus eu velit, phasellus pulvinar lorem et libero et tortor, sapien nulla.</p>
            <div className="flex flex-wrap -mx-4 text-center">
                <div className="w-full md:w-1/3 px-4 mb-8 md:mb-0">
                    <i className="fas fa-vials text-5xl text-blue-600 mb-4"></i>
                    <h5 className="text-xl font-bold text-gray-800 mb-4">High Quality Lab</h5>
                    <p className="text-gray-600">In lacinia nisl, a tempor diam luctus elit vulputate aliquet proin tincidunt</p>
                </div>
                <div className="w-full md:w-1/3 px-4 mb-8 md:mb-0">
                    <i className="fas fa-brain text-5xl text-blue-600 mb-4"></i>
                    <h5 className="text-xl font-bold text-gray-800 mb-4">Unmatched Expertise</h5>
                    <p className="text-gray-600">In lacinia nisl, a tempor diam luctus elit vulputate aliquet proin tincidunt</p>
                </div>
                <div className="w-full md:w-1/3 px-4">
                    <i className="fas fa-microscope text-5xl text-blue-600 mb-4"></i>
                    <h5 className="text-xl font-bold text-gray-800 mb-4">Precise Result</h5>
                    <p className="text-gray-600">In lacinia nisl, a tempor diam luctus elit vulputate aliquet proin tincidunt</p>
                </div>
            </div>
        </section>

        <section className="bg-white py-12">
            <div className="container mx-auto px-6">
                <h2 className="text-4xl font-bold text-center text-gray-800 mb-8">Our Expert Team</h2>
                <div className="flex flex-wrap -mx-4">
                    <div className="w-full md:w-1/3 px-4 mb-8">
                        <img className="rounded-lg shadow-lg mb-4" src="https://placehold.co/300x300" alt="Portrait of Margaret Anderson, Head of Laboratory Department" />
                        <h5 className="text-xl font-bold text-gray-800">Margaret Anderson</h5>
                        <p className="text-gray-600">Head of Laboratory Department</p>
                    </div>
                    <div className="w-full md:w-1/3 px-4 mb-8">
                        <img className="rounded-lg shadow-lg mb-4" src="https://placehold.co/300x300" alt="Portrait of Mark Anthony, Senior Pathologist" />
                        <h5 className="text-xl font-bold text-gray-800">Mark Anthony</h5>
                        <p className="text-gray-600">Senior Pathologist</p>
                    </div>
                    <div className="w-full md:w-1/3 px-4">
                        <img className="rounded-lg shadow-lg mb-4" src="https://placehold.co/300x300" alt="Portrait of Samantha Wood, Laboratory Technician" />
                        <h5 className="text-xl font-bold text-gray-800">Samantha Wood</h5>
                        <p className="text-gray-600">Laboratory Technician</p>
                    </div>
                </div>
            </div>
        </section>

        <section className="bg-blue-600">
            <div className="container mx-auto px-6 py-12 text-center">
                <h2 className="text-3xl font-bold text-white mb-6">Subscribe To Our Newsletter</h2>
                <p className="text-white mb-6">Stay in touch with us to get latest news and special offers.</p>
                <div className="flex justify-center">
                    <input type="email" className="px-4 py-2 w-1/3 rounded-l" placeholder="Your email address"/>
                    <button className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-r">Subscribe</button>
                </div>
            </div>
        </section>

        <footer className="bg-gray-800 text-white">
            <div className="container mx-auto px-6 py-4">
                <div className="flex flex-wrap justify-between">
                    <div className="w-full md:w-1/4 mb-6 md:mb-0">
                        <h5 className="uppercase font-bold mb-4">Address</h5>
                        <p>123 5th Avenue, New York, US</p>
                    </div>
                    <div className="w-full md:w-1/4 mb-6 md:mb-0">
                        <h5 className="uppercase font-bold mb-4">Call Us</h5>
                        <p>+1 123 456 7890</p>
                    </div>
                    <div className="w-full md:w-1/4 mb-6 md:mb-0">
                        <h5 className="uppercase font-bold mb-4">Email Us</h5>
                        <p>info@example.com</p>
                    </div>
                    <div className="w-full md:w-1/4">
                        <h5 className="uppercase font-bold mb-4">Follow Us</h5>
                        <div className="flex items-center space-x-4">
                            <a href="#" className="text-blue-400 hover:text-blue-500"><i className="fab fa-facebook-f"></i></a>
                            <a href="#" className="text-blue-400 hover:text-blue-500"><i className="fab fa-twitter"></i></a>
                            <a href="#" className="text-blue-400 hover:text-blue-500"><i className="fab fa-google-plus-g"></i></a>
                            <a href="#" className="text-blue-400 hover:text-blue-500"><i className="fab fa-youtube"></i></a>
                            <a href="#" className="text-blue-400 hover:text-blue-500"><i className="fab fa-linkedin-in"></i></a>
                        </div>
                    </div>
                </div>
                <div className="border-t border-gray-700 mt-6 pt-6 text-gray-600 text-sm">
                    <p>Powered by Diagnostics Lab</p>
                </div>
            </div>
        </footer>
    </main>
    </>
  )
}

export default HomePage
