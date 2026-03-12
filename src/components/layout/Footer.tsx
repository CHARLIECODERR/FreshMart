'use client'

import React from 'react'
import Link from 'next/link'
import { Instagram, Twitter, Facebook, Mail, MapPin, Phone } from 'lucide-react'
import LiveVisitors from '../common/LiveVisitors'

export default function Footer() {
    const currentYear = new Date().getFullYear()

    return (
        <footer className="bg-white border-t border-slate-200 pt-12 pb-6 px-4 md:px-8 mt-12 w-full hidden md:block">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">

                {/* Brand Column */}
                <div className="md:col-span-1 space-y-4">
                    <Link href="/" className="font-display font-bold text-2xl text-primary-600 block mb-4">
                        FreshMart
                    </Link>
                    <p className="text-sm text-slate-500 leading-relaxed pr-6">
                        Your daily needs, delivered fresh and fast right to your doorstep. We partner with local farms and top brands to ensure quality.
                    </p>
                    <div className="flex items-center gap-4 pt-2">
                        <a href="#" className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-primary-50 hover:text-primary-600 transition-colors">
                            <Instagram size={16} />
                        </a>
                        <a href="#" className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-primary-50 hover:text-primary-600 transition-colors">
                            <Twitter size={16} />
                        </a>
                        <a href="#" className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-primary-50 hover:text-primary-600 transition-colors">
                            <Facebook size={16} />
                        </a>
                    </div>

                    <div className="pt-2">
                        <LiveVisitors />
                    </div>
                </div>

                {/* Links Column */}
                <div className="col-span-1">
                    <h4 className="font-semibold text-slate-900 mb-4">Quick Links</h4>
                    <ul className="space-y-3">
                        <li><Link href="/" className="text-sm text-slate-500 hover:text-primary-600 transition-colors">Home</Link></li>
                        <li><Link href="/shop" className="text-sm text-slate-500 hover:text-primary-600 transition-colors">Shop All</Link></li>
                        <li><Link href="/about" className="text-sm text-slate-500 hover:text-primary-600 transition-colors">About Us</Link></li>
                        <li><Link href="/account" className="text-sm text-slate-500 hover:text-primary-600 transition-colors">My Account</Link></li>
                    </ul>
                </div>

                {/* Support Column */}
                <div className="col-span-1">
                    <h4 className="font-semibold text-slate-900 mb-4">Support</h4>
                    <ul className="space-y-3">
                        <li><a href="mailto:support@freshmart.in" className="text-sm text-slate-500 hover:text-primary-600 transition-colors inline-flex items-center gap-2"><Mail size={14} /> Contact Us</a></li>
                        <li><a href="#" className="text-sm text-slate-500 hover:text-primary-600 transition-colors inline-flex items-center gap-2"><Phone size={14} /> +91 98765 43210</a></li>
                        <li><Link href="/faq" className="text-sm text-slate-500 hover:text-primary-600 transition-colors">FAQs</Link></li>
                        <li><Link href="/privacy-policy" className="text-sm text-slate-500 hover:text-primary-600 transition-colors">Privacy Policy</Link></li>
                        <li><Link href="/terms" className="text-sm text-slate-500 hover:text-primary-600 transition-colors">Terms of Service</Link></li>
                    </ul>
                </div>

                {/* Newsletter Column */}
                <div className="col-span-1">
                    <h4 className="font-semibold text-slate-900 mb-4">Newsletter</h4>
                    <p className="text-sm text-slate-500 mb-4">Get 10% off your first order by subscribing.</p>
                    <form className="flex rounded-lg overflow-hidden border border-slate-200 focus-within:ring-2 focus-within:ring-primary-500 focus-within:border-primary-500 transition-shadow">
                        <input
                            type="email"
                            placeholder="Your email address"
                            className="flex-1 px-3 py-2 text-sm outline-none bg-slate-50"
                            required
                        />
                        <button type="submit" className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 text-sm font-medium transition-colors">
                            Subscribe
                        </button>
                    </form>
                </div>

            </div>

            {/* Bottom Bar */}
            <div className="max-w-7xl mx-auto border-t border-slate-100 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
                <p className="text-sm text-slate-500">
                    © {currentYear} FreshMart. All rights reserved.
                </p>
                <div className="flex items-center gap-4">
                    {/* Payment Methods mock images */}
                    <div className="flex gap-2 text-slate-400">
                        <span className="text-xs font-bold bg-slate-100 px-2 py-1 rounded">VISA</span>
                        <span className="text-xs font-bold bg-slate-100 px-2 py-1 rounded">UPI</span>
                        <span className="text-xs font-bold bg-slate-100 px-2 py-1 rounded">RuPay</span>
                        <span className="text-xs font-bold bg-slate-100 px-2 py-1 rounded">COD</span>
                    </div>
                </div>
            </div>
        </footer>
    )
}
