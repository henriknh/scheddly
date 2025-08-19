"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function FAQSection() {
  const faqs = [
    {
      question: "How does Scheddly work?",
      answer:
        "Scheddly is a social media scheduling tool that lets you create and schedule content across multiple platforms from one dashboard. Connect your social media accounts, create your posts, and schedule them for the best posting times.",
    },
    {
      question: "Which social media platforms do you support?",
      answer:
        "We support Instagram, Facebook, X (Twitter), LinkedIn, Pinterest, TikTok, and Tumblr. We're always working on adding more platforms based on what our users need.",
    },
    {
      question: "Can I post to multiple social media accounts at once?",
      answer:
        "Yes! You can create one post and schedule it across multiple social media platforms at the same time. This saves you time and ensures your content reaches all your audiences when they're most active.",
    },
    {
      question: "What type of posts can I create?",
      answer:
        "Scheddly supports the main post types: images, videos, and text posts. You can add captions and hashtags. We support the core features that each platform offers.",
    },
    {
      question: "Am I limited in how many posts I can create?",
      answer:
        "No limits on creating posts! You can create as many posts as you need, whether you're posting daily or planning content weeks in advance. Different plans have different scheduling limits, but post creation is unlimited.",
    },
    {
      question: "Does it affect my brand by using a scheduler?",
      answer:
        "Not at all. Many successful brands and creators use scheduling tools to maintain consistent posting schedules. Scheddly helps you post at the best times for engagement while keeping your content authentic and on-brand.",
    },
    {
      question: "Can I schedule posts for multiple brands?",
      answer:
        "Yes! Our Professional plan lets you manage multiple brands and schedule content for each one separately. This is perfect for agencies and businesses that manage multiple clients or brands.",
    },
    {
      question: "What analytics do you provide?",
      answer:
        "We provide analytics including post performance, engagement rates, best posting times, and audience insights. Our Professional plan includes advanced analytics and ROI tracking for e-commerce integrations.",
    },
    {
      question: "Do I need to share my password with you?",
      answer:
        "No, never! We use OAuth authentication, which is the secure way most apps connect to social media. You log in through each platform's official login page, and we never see your passwords.",
    },
    {
      question: "Is my data secure?",
      answer:
        "Yes, absolutely. We use industry-standard security practices and encryption. Your social media credentials are stored securely, and we never post without your permission.",
    },
    {
      question: "Can I cancel my subscription anytime?",
      answer:
        "Yes, you can cancel your subscription at any time. You'll continue to have access to your account until the end of your current billing period.",
    },
  ];

  return (
    <section id="faq" className="pt-32">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
        <p className="text-lg text-muted-foreground">
          Everything you need to know about Scheddly
        </p>
      </div>
      <div className="max-w-4xl mx-auto">
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
