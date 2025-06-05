import React from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Logo from "@/components/ui/logo";

const TermsOfService = () => {
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
              Terms of Service
            </h1>
            
            <div className="prose prose-lg prose-invert max-w-none">
              <p className="text-white/80 font-inter text-lg mb-8">
                Last updated: {new Date().toLocaleDateString()}
              </p>

              <div className="space-y-8">
                <section>
                  <h2 className="text-2xl font-space font-bold text-white mb-4">
                    Agreement to Terms
                  </h2>
                  <p className="text-white/70 font-inter leading-relaxed">
                    By accessing and using SWiM Agency's services, you accept and agree to be bound by the terms and provision of this agreement. These Terms of Service govern your use of our website, AI marketing solutions, workflow automation services, and related offerings.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-space font-bold text-white mb-4">
                    Services Description
                  </h2>
                  <p className="text-white/70 font-inter leading-relaxed mb-4">
                    SWiM Agency provides AI-powered marketing solutions, including but not limited to:
                  </p>
                  <ul className="list-disc list-inside text-white/70 font-inter space-y-2">
                    <li>AI-powered marketing automation and optimization</li>
                    <li>Custom workflow automation solutions</li>
                    <li>B2B SaaS development and integration</li>
                    <li>Data intelligence and analytics services</li>
                    <li>AI strategy consulting and implementation</li>
                    <li>AI security and ethics compliance</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-space font-bold text-white mb-4">
                    User Responsibilities
                  </h2>
                  <p className="text-white/70 font-inter leading-relaxed mb-4">
                    As a user of our services, you agree to:
                  </p>
                  <ul className="list-disc list-inside text-white/70 font-inter space-y-2">
                    <li>Provide accurate and complete information when requested</li>
                    <li>Maintain the security of your account credentials</li>
                    <li>Use our services in compliance with applicable laws and regulations</li>
                    <li>Not engage in activities that could harm our systems or other users</li>
                    <li>Respect intellectual property rights and confidentiality</li>
                    <li>Provide timely feedback and cooperation during project implementation</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-space font-bold text-white mb-4">
                    Service Availability and Performance
                  </h2>
                  <p className="text-white/70 font-inter leading-relaxed">
                    While we strive to provide reliable and continuous service, we do not guarantee uninterrupted access to our services. We reserve the right to modify, suspend, or discontinue any aspect of our services with reasonable notice. Performance metrics and outcomes may vary based on individual client circumstances and implementation factors.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-space font-bold text-white mb-4">
                    Intellectual Property Rights
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-xl font-space font-semibold text-accent mb-2">
                        Our IP Rights
                      </h3>
                      <p className="text-white/70 font-inter leading-relaxed">
                        All proprietary technologies, methodologies, and intellectual property developed by SWiM Agency remain our exclusive property. This includes AI models, automation frameworks, and custom software solutions.
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-space font-semibold text-accent mb-2">
                        Client IP Rights
                      </h3>
                      <p className="text-white/70 font-inter leading-relaxed">
                        You retain ownership of your data, content, and pre-existing intellectual property. Custom developments specifically created for your business needs will be transferred to you upon full payment, unless otherwise agreed in writing.
                      </p>
                    </div>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-space font-bold text-white mb-4">
                    Data Privacy and Security
                  </h2>
                  <p className="text-white/70 font-inter leading-relaxed">
                    We are committed to protecting your data privacy and maintaining high security standards. Our data handling practices are detailed in our Privacy Policy. We implement industry-standard security measures and comply with applicable data protection regulations including GDPR and CCPA where applicable.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-space font-bold text-white mb-4">
                    Payment Terms and Billing
                  </h2>
                  <div className="space-y-4">
                    <p className="text-white/70 font-inter leading-relaxed">
                      Payment terms will be specified in individual service agreements. Generally:
                    </p>
                    <ul className="list-disc list-inside text-white/70 font-inter space-y-2">
                      <li>Invoices are due within 30 days of receipt unless otherwise specified</li>
                      <li>Late payments may incur additional fees and service suspension</li>
                      <li>Refund policies vary by service type and will be detailed in project agreements</li>
                      <li>Subscription services may be subject to automatic renewal</li>
                    </ul>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-space font-bold text-white mb-4">
                    Limitation of Liability
                  </h2>
                  <p className="text-white/70 font-inter leading-relaxed">
                    To the maximum extent permitted by law, SWiM Agency shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, or business opportunities. Our total liability shall not exceed the amount paid by you for the specific service giving rise to the claim.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-space font-bold text-white mb-4">
                    Confidentiality
                  </h2>
                  <p className="text-white/70 font-inter leading-relaxed">
                    Both parties agree to maintain confidentiality of proprietary information shared during the course of our business relationship. This includes business strategies, technical specifications, customer data, and any other sensitive information marked as confidential.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-space font-bold text-white mb-4">
                    Termination
                  </h2>
                  <p className="text-white/70 font-inter leading-relaxed">
                    Either party may terminate services with appropriate notice as specified in individual agreements. Upon termination, you will receive deliverables completed up to the termination date, and we will securely return or destroy your confidential information as requested.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-space font-bold text-white mb-4">
                    Governing Law and Disputes
                  </h2>
                  <p className="text-white/70 font-inter leading-relaxed">
                    These terms shall be governed by the laws of the jurisdiction where SWiM Agency is incorporated. Any disputes will be resolved through binding arbitration or in the appropriate courts of that jurisdiction.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-space font-bold text-white mb-4">
                    Changes to Terms
                  </h2>
                  <p className="text-white/70 font-inter leading-relaxed">
                    We reserve the right to modify these Terms of Service at any time. We will notify you of significant changes via email or through our website. Continued use of our services after changes indicates acceptance of the new terms.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-space font-bold text-white mb-4">
                    Contact Information
                  </h2>
                  <p className="text-white/70 font-inter leading-relaxed">
                    For questions about these Terms of Service or our services, please contact us:
                  </p>
                  <div className="mt-4 p-4 bg-primary/20 rounded-lg">
                    <p className="text-white font-inter">
                      <strong>SWiM Agency</strong><br />
                      Email: legal@swimagency.com<br />
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

export default TermsOfService;