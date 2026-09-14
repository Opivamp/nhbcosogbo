import React, { useState, useEffect } from 'react';
import { Clock, MapPin, Users, Heart, Sparkles, ShieldCheck, HelpCircle, ArrowRight, BookOpen, ChevronDown, ChevronUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';

export default function PlanVisit() {
  const [orderOfService, setOrderOfService] = useState([]);
  const [showOrder, setShowOrder] = useState(true);

  useEffect(() => {
    async function loadOrder() {
      try {
        const data = await api.getOrderOfService();
        setOrderOfService(data || []);
      } catch (err) {
        console.error('Failed to load order of service', err);
      }
    }
    loadOrder();
  }, []);

  const faqs = [
    {
      q: 'What should I wear?',
      a: 'Come as you are! In our congregation, you will see everything from traditional Nigerian native attire (Aso-Oke, Agbada, Ankara) to formal suits and smart casual clothes. We care about your heart, not your outfit.',
    },
    {
      q: 'What is the worship service like?',
      a: 'Our services combine Christ-centered Baptist hymnody, uplifting contemporary African praise, heartfelt prayer, and deep exposition of the Word of God that applies to your everyday life.',
    },
    {
      q: 'Is there something for my children?',
      a: 'Yes! We have an active, safe, and engaging Childrenâ€™s Church with vetted teachers who nurture young hearts with biblical lessons, songs, and age-appropriate activities.',
    },
    {
      q: 'Where do I park when I arrive?',
      a: 'Our church premises offer secure on-site parking monitored by our trained church marshals and protocol team, ready to guide you to a spot with a smile.',
    },
    {
      q: 'Will I be pointed out or embarrassed as a first-timer?',
      a: 'Never! We give our first-time guests a warm, dignifying Baptist welcome. You will receive a warm handshake, special hospitality package, and an opportunity to meet the pastor if you wish.',
    },
  ];

  return (
    <div className="bg-sand-50 min-h-screen">
      {/* Hero Banner */}
      <div className="bg-navy-900 text-white py-16 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="max-w-6xl mx-auto text-center relative z-10 flex flex-col items-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white p-1 shadow-xl ring-2 ring-gold-400/40 flex items-center justify-center mb-4">
            <img 
              src="/nhbc-logo.png" 
              alt="NHBC Osogbo Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/20 text-gold-300 text-xs font-semibold uppercase tracking-wider mb-4 border border-gold-400/30">
            <Users className="w-3.5 h-3.5" /> First-Time Guest Guide
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">
            We Have Saved a Seat For You
          </h1>
          <p className="text-navy-200 text-lg max-w-2xl mx-auto">
            Visiting a church for the first time should be warm, easy, and spiritually uplifting. Here is everything you need to know about joining us in Osogbo.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        {/* 3 Step Guide */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-6 rounded-2xl border border-sand-200 shadow-sm relative">
            <div className="w-10 h-10 rounded-full bg-navy-900 text-gold-400 font-bold flex items-center justify-center mb-4">
              1
            </div>
            <h3 className="text-lg font-serif font-bold text-navy-900 mb-2">Choose a Service Time</h3>
            <p className="text-navy-600 text-sm leading-relaxed">
              Join our Sunday School at 8:30 AM followed by our glorious Main Worship Service at 9:30 AM, or mid-week Prayer & Bible Study on Wednesdays at 5:30 PM.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-sand-200 shadow-sm relative">
            <div className="w-10 h-10 rounded-full bg-navy-900 text-gold-400 font-bold flex items-center justify-center mb-4">
              2
            </div>
            <h3 className="text-lg font-serif font-bold text-navy-900 mb-2">Arrive & Be Welcomed</h3>
            <p className="text-navy-600 text-sm leading-relaxed">
              Our Hospitality and Protocol team will meet you at the door, assist with seating, and ensure you and your family are comfortably settled.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-sand-200 shadow-sm relative">
            <div className="w-10 h-10 rounded-full bg-navy-900 text-gold-400 font-bold flex items-center justify-center mb-4">
              3
            </div>
            <h3 className="text-lg font-serif font-bold text-navy-900 mb-2">Fellowship After Service</h3>
            <p className="text-navy-600 text-sm leading-relaxed">
              First-time guests are invited to a brief 5-minute meet-and-greet with our pastoral team for light refreshments and personal prayer.
            </p>
          </div>
        </div>

        {/* Schedule & Location Box */}
        <div className="bg-navy-900 text-white rounded-3xl p-8 md:p-12 shadow-xl mb-16 relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center relative z-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/20 text-gold-300 text-xs font-semibold mb-4 border border-gold-400/30">
                <Clock className="w-3.5 h-3.5" /> Weekly Fellowship Schedule
              </div>
              <h2 className="text-3xl font-serif font-bold mb-4">Service Schedule in Osogbo</h2>
              <ul className="space-y-4 text-sm text-navy-200">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-gold-400 mt-2 shrink-0"></div>
                  <div>
                    <strong className="text-white block">Sunday School & Discipleship</strong>
                    <span>Sundays: 8:30 AM - 9:30 AM</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-gold-400 mt-2 shrink-0"></div>
                  <div>
                    <strong className="text-white block">Sunday Worship & Word Celebration</strong>
                    <span>Sundays: 9:30 AM - 12:00 PM</span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-gold-400 mt-2 shrink-0"></div>
                  <div>
                    <strong className="text-white block">Mid-Week Bible Study & Prayers</strong>
                    <span>Wednesdays: 5:30 PM - 7:00 PM</span>
                  </div>
                </li>
              </ul>
            </div>

            <div className="bg-navy-800/80 p-6 rounded-2xl border border-navy-700">
              <div className="flex items-center gap-3 mb-3">
                <MapPin className="w-5 h-5 text-gold-400 shrink-0" />
                <h3 className="font-serif font-bold text-lg text-white">Location & Address</h3>
              </div>
              <p className="text-navy-300 text-sm mb-4 leading-relaxed">
                [Church Address, Osogbo, Osun State, Nigeria]
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  to="/contact"
                  className="px-5 py-2.5 rounded-lg bg-gold-500 hover:bg-gold-600 text-navy-950 font-bold text-xs text-center transition-colors shadow-md"
                >
                  Get Full Directions & Map
                </Link>
                <Link
                  to="/prayer"
                  className="px-5 py-2.5 rounded-lg bg-navy-700 hover:bg-navy-600 text-white font-semibold text-xs text-center transition-colors"
                >
                  Request a Pastoral Call
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Digital Sunday Order of Service */}
        {orderOfService.length > 0 && (
          <div className="bg-white rounded-3xl border border-sand-200 p-8 shadow-sm mb-16">
            <div className="flex items-center justify-between cursor-pointer" onClick={() => setShowOrder(!showOrder)}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gold-100 text-gold-600 flex items-center justify-center">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-xl text-navy-900">
                    What Happens During Sunday Worship? (Order of Service)
                  </h3>
                  <p className="text-xs text-navy-500">
                    A typical flow of our reverent Baptist worship liturgy and praise.
                  </p>
                </div>
              </div>
              <button className="p-2 rounded-lg bg-sand-100 text-navy-700 hover:bg-sand-200">
                {showOrder ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
            </div>

            {showOrder && (
              <div className="mt-6 pt-6 border-t border-sand-100 divide-y divide-sand-100">
                {orderOfService.map((item, idx) => (
                  <div key={idx} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between text-sm gap-1">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-navy-100 text-navy-800 text-xs font-bold flex items-center justify-center shrink-0">
                        {item.order || idx + 1}
                      </span>
                      <span className="font-semibold text-navy-900">{item.activity}</span>
                    </div>
                    <span className="text-xs text-gold-700 font-medium sm:text-right pl-9 sm:pl-0">
                      {item.detail}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* FAQs */}
        <div>
          <div className="text-center mb-10">
            <HelpCircle className="w-10 h-10 text-gold-500 mx-auto mb-2" />
            <h2 className="text-3xl font-serif font-bold text-navy-900">
              Frequently Asked Questions
            </h2>
            <p className="text-navy-600 text-sm mt-1">
              Have questions prior to visiting? We have got you covered.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="bg-white p-6 rounded-2xl border border-sand-200 shadow-sm"
              >
                <h4 className="font-serif font-bold text-navy-900 text-base mb-2">{faq.q}</h4>
                <p className="text-navy-600 text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}