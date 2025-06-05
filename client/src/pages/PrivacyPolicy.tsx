import React from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Logo from "@/components/ui/logo";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-secondary to-dark-navy">
      <div className="container mx-auto px-6 md:px-12 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-12">
            <Logo />
            <Link href="/">
              <Button variant="outline" size="sm" className="bg-transparent border-accent text-accent hover:bg-accent hover:text-primary">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>

          {/* Content */}
          <div className="glass rounded-2xl p-8 md:p-12">
            <h1 className="text-4xl md:text-5xl font-space font-bold mb-8 text-white">
              Privacy Policy
            </h1>
            
            <div className="prose prose-lg prose-invert max-w-none">
              <p className="text-white/80 font-inter text-lg mb-8">
                Last updated: {new Date().toLocaleDateString()}
              </p>

              <div className="space-y-8">
                <section>
                  <h2 className="text-2xl font-space font-bold text-white mb-4">
                    Introduction
                  </h2>
                  <p className="text-white/70 font-inter leading-relaxed">
                    SWiM Agency ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-space font-bold text-white mb-4">
                    Information We Collect
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-xl font-space font-semibold text-accent mb-2">
                        Personal Information
                      </h3>
                      <p className="text-white/70 font-inter leading-relaxed">
                        We may collect personal information that you voluntarily provide, including:
                      </p>
                      <ul className="list-disc list-inside text-white/70 font-inter mt-2 space-y-1">
                        <li>Name and contact information</li>
                        <li>Email address and phone number</li>
                        <li>Company information and job title</li>
                        <li>Project requirements and specifications</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-space font-semibold text-accent mb-2">
                        Automatically Collected Information
                      </h3>
                      <p className="text-white/70 font-inter leading-relaxed">
                        We automatically collect certain information when you visit our website:
                      </p>
                      <ul className="list-disc list-inside text-white/70 font-inter mt-2 space-y-1">
                        <li>IP address and browser information</li>
                        <li>Device and operating system details</li>
                        <li>Website usage patterns and analytics</li>
                        <li>Cookies and similar tracking technologies</li>
                      </ul>
                    </div>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-space font-bold text-white mb-4">
                    How We Use Your Information
                  </h2>
                  <p className="text-white/70 font-inter leading-relaxed mb-4">
                    We use the information we collect to:
                  </p>
                  <ul className="list-disc list-inside text-white/70 font-inter space-y-2">
                    <li>Provide and improve our AI marketing and automation services</li>
                    <li>Respond to your inquiries and communicate with you</li>
                    <li>Customize and enhance your experience with our services</li>
                    <li>Analyze website usage and optimize our platform</li>
                    <li>Send relevant updates and marketing communications (with consent)</li>
                    <li>Comply with legal obligations and protect our rights</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-space font-bold text-white mb-4">
                    Information Sharing and Disclosure
                  </h2>
                  <p className="text-white/70 font-inter leading-relaxed mb-4">
                    We do not sell, trade, or rent your personal information. We may share information in the following circumstances:
                  </p>
                  <ul className="list-disc list-inside text-white/70 font-inter space-y-2">
                    <li>With trusted service providers who assist in our operations</li>
                    <li>When required by law or to protect our legal rights</li>
                    <li>In connection with a business transfer or acquisition</li>
                    <li>With your explicit consent for specific purposes</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-space font-bold text-white mb-4">
                    Data Security
                  </h2>
                  <p className="text-white/70 font-inter leading-relaxed">
                    We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no internet transmission is completely secure, and we cannot guarantee absolute security.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-space font-bold text-white mb-4">
                    Your Rights and Choices
                  </h2>
                  <p className="text-white/70 font-inter leading-relaxed mb-4">
                    Depending on your location, you may have the following rights:
                  </p>
                  <ul className="list-disc list-inside text-white/70 font-inter space-y-2">
                    <li>Access and review your personal information</li>
                    <li>Request correction of inaccurate data</li>
                    <li>Request deletion of your personal information</li>
                    <li>Object to or restrict processing of your data</li>
                    <li>Data portability and withdrawal of consent</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-space font-bold text-white mb-4">
                    Cookies and Tracking Technologies
                  </h2>
                  <p className="text-white/70 font-inter leading-relaxed">
                    We use cookies and similar technologies to enhance your browsing experience, analyze site usage, and assist in our marketing efforts. You can control cookie preferences through your browser settings.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-space font-bold text-white mb-4">
                    Updates to This Policy
                  </h2>
                  <p className="text-white/70 font-inter leading-relaxed">
                    We may update this Privacy Policy periodically to reflect changes in our practices or legal requirements. We will notify you of significant changes by posting the updated policy on our website.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-space font-bold text-white mb-4">
                    Contact Us
                  </h2>
                  <p className="text-white/70 font-inter leading-relaxed">
                    If you have questions about this Privacy Policy or our data practices, please contact us:
                  </p>
                  <div className="mt-4 p-4 bg-primary/20 rounded-lg">
                    <p className="text-white font-inter">
                      <strong>SWiM Agency</strong><br />
                      Email: privacy@swimagency.com<br />
                      Website: www.swimagency.com
                    </p>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;