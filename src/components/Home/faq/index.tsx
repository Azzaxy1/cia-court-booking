"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { faqData } from "@/constants/faq";
import { FaqItemProps } from "@/types/FaqItem";
import Link from "next/link";

const FaqItem = ({
  question,
  answer,
  isOpen,
  toggleAccordion,
}: FaqItemProps) => {
  return (
    <div className="border border-gray-200 rounded-lg mb-4 overflow-hidden">
      <button
        className="w-full flex justify-between items-center p-4 text-left bg-white hover:bg-gray-50 focus:outline-none transition-colors"
        onClick={toggleAccordion}
      >
        <h3 className="text-base md:text-lg font-medium text-gray-900">
          {question}
        </h3>
        <span className="text-teal-600 flex-shrink-0 ml-2">
          {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </span>
      </button>
      {isOpen && (
        <div className="p-4 bg-gray-50 border-t border-gray-200">
          <p className="text-gray-700">{answer}</p>
        </div>
      )}
    </div>
  );
};

const Faq = () => {
  const [openAccordion, setOpenAccordion] = useState<number | null>(null);

  const toggleAccordion = (id: number) => {
    setOpenAccordion(openAccordion === id ? null : id);
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl 2xl:text-4xl font-semibold leading-tight text-slate-800 mb-4">
              Ada pertanyaan?
            </h2>
            <p className="text-sm sm:text-base 2xl:text-lg mt-4  text-slate-600">
              Kami telah merangkum jawaban atas berbagai pertanyaan yang sering
              diajukan. Jika masih ada yang belum terjawab, silahkan hubungi WA
              kami!
            </p>
          </div>

          <div className="mt-8">
            {faqData.map((faq) => (
              <FaqItem
                key={faq.id}
                question={faq.question}
                answer={faq.answer}
                isOpen={openAccordion === faq.id}
                toggleAccordion={() => toggleAccordion(faq.id)}
              />
            ))}
          </div>

          <div className="mt-8 text-center">
            <p className="text-gray-600 mb-4">Masih punya pertanyaan?</p>
            <Link
              href="https://wa.me/6285182198144"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 bg-primary hover:bg-primary-foreground text-white font-medium rounded-lg transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Hubungi Kami di WhatsApp
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Faq;
