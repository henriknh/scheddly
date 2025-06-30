import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TermsOfServicePage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-6">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Terms of Service</h1>
          <p className="text-muted-foreground">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>1. Acceptance of Terms</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              By accessing and using Scheddly (&ldquo;the Service&rdquo;), you
              accept and agree to be bound by the terms and provision of this
              agreement. If you do not agree to abide by the above, please do
              not use this service.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>2. Description of Service</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Scheddly is a social media scheduling platform that allows users
              to:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li>
                Create and schedule posts for various social media platforms
              </li>
              <li>Manage multiple social media accounts and brands</li>
              <li>Upload and store media files (images, videos)</li>
              <li>Collaborate with team members</li>
              <li>Track post performance and analytics</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>3. User Accounts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">3.1 Account Creation</h3>
              <p className="text-muted-foreground">
                To use our service, you must create an account. You agree to
                provide accurate, current, and complete information during
                registration and to update such information to keep it accurate,
                current, and complete.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">3.2 Account Security</h3>
              <p className="text-muted-foreground">
                You are responsible for safeguarding the password and for all
                activities that occur under your account. You agree to notify us
                immediately of any unauthorized use of your account.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">3.3 Account Termination</h3>
              <p className="text-muted-foreground">
                We reserve the right to terminate or suspend your account at any
                time for violations of these terms or for any other reason at
                our sole discretion.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>4. Acceptable Use</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              You agree not to use the service to:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li>
                Post content that is illegal, harmful, threatening, abusive, or
                defamatory
              </li>
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe on intellectual property rights</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Interfere with or disrupt the service</li>
              <li>Use the service for spam or unsolicited communications</li>
              <li>Share account credentials with unauthorized users</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>5. Content and Intellectual Property</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">5.1 Your Content</h3>
              <p className="text-muted-foreground">
                You retain ownership of content you create and upload to our
                service. By using our service, you grant us a limited license to
                store, process, and transmit your content to the social media
                platforms you authorize.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">5.2 Our Content</h3>
              <p className="text-muted-foreground">
                The service, including its original content, features, and
                functionality, is owned by Scheddly and is protected by
                international copyright, trademark, and other intellectual
                property laws.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>6. Social Media Platform Integration</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Our service integrates with third-party social media platforms. By
              connecting your social media accounts:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li>You authorize us to post content on your behalf</li>
              <li>
                You agree to comply with each platform&apos;s terms of service
              </li>
              <li>
                We are not responsible for content posted by third-party
                platforms
              </li>
              <li>
                You can revoke access at any time through your account settings
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>7. Payment and Subscription</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Some features of our service may require a paid subscription.
              Payment terms, pricing, and subscription details will be clearly
              communicated before purchase. All payments are non-refundable
              except as required by law.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>8. Privacy and Data Protection</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Your privacy is important to us. Our collection and use of
              personal information is governed by our Privacy Policy, which is
              incorporated into these terms by reference.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>9. Disclaimers and Limitations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">9.1 Service Availability</h3>
              <p className="text-muted-foreground">
                We strive to provide reliable service but cannot guarantee
                uninterrupted access. The service is provided &ldquo;as
                is&rdquo; without warranties of any kind.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">
                9.2 Limitation of Liability
              </h3>
              <p className="text-muted-foreground">
                In no event shall Scheddly be liable for any indirect,
                incidental, special, consequential, or punitive damages arising
                out of or relating to your use of the service.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>10. Indemnification</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              You agree to indemnify and hold harmless Scheddly from any claims,
              damages, or expenses arising from your use of the service or
              violation of these terms.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>11. Governing Law</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              These terms shall be governed by and construed in accordance with
              the laws of the jurisdiction in which Scheddly operates, without
              regard to conflict of law principles.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>12. Changes to Terms</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              We reserve the right to modify these terms at any time. We will
              notify users of significant changes via email or through the
              service. Your continued use of the service after changes
              constitutes acceptance of the new terms.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>13. Contact Information</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              If you have any questions about these terms of service, please
              contact us at:
            </p>
            <div className="mt-2 p-4 bg-muted rounded-lg">
              <p className="font-medium">Scheddly Support</p>
              <p className="text-muted-foreground">Email: legal@scheddly.com</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
