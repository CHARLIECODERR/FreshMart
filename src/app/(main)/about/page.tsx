'use client'

import React from 'react'

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-background pt-8 pb-20 px-4 max-w-3xl mx-auto animate-fade-in">
            <h1 className="font-display font-bold text-3xl text-gray-900 mb-6">About FreshMart</h1>

            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 space-y-6 prose prose-green max-w-none">

                <p className="text-lg text-gray-700 leading-relaxed font-medium">
                    FreshMart is your friendly neighborhood online grocery store, designed to bring fresh, high-quality, and affordable essentials straight to your doorstep.
                </p>

                <div className="grid md:grid-cols-2 gap-6 mt-8">
                    <div className="bg-primary-50 rounded-2xl p-5 border border-primary-100">
                        <h3 className="font-bold text-primary-800 mb-2 text-lg">Our Mission</h3>
                        <p className="text-primary-700 text-sm leading-relaxed">
                            To make daily grocery shopping effortless, fast, and accessible for every Indian household while supporting local farmers and producers.
                        </p>
                    </div>
                    <div className="bg-orange-50 rounded-2xl p-5 border border-orange-100">
                        <h3 className="font-bold text-orange-800 mb-2 text-lg">Our Promise</h3>
                        <p className="text-orange-700 text-sm leading-relaxed">
                            We guarantee 100% freshness on all produce. If you're not satisfied, we offer a no-questions-asked refund policy.
                        </p>
                    </div>
                </div>

                <h2 className="font-bold text-xl text-gray-900 pt-4">Why choose us?</h2>
                <ul className="space-y-3 text-gray-600">
                    <li className="flex items-start gap-2">
                        <span className="text-primary-500 font-bold mt-0.5">✓</span>
                        <span><strong>Handpicked Quality:</strong> Every item is double-checked for quality before packing.</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-primary-500 font-bold mt-0.5">✓</span>
                        <span><strong>Lightning Fast Delivery:</strong> Most orders are delivered within 2 hours.</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-primary-500 font-bold mt-0.5">✓</span>
                        <span><strong>Transparent Pricing:</strong> No hidden charges. What you see is what you pay.</span>
                    </li>
                </ul>

                <div className="mt-8 pt-8 border-t border-gray-100">
                    <h2 className="font-bold text-xl text-gray-900 mb-4">Contact Us</h2>
                    <p className="text-gray-600 mb-2">Have a question or need help with your order?</p>
                    <p className="font-medium text-gray-900">Email: support@freshmart.in</p>
                    <p className="font-medium text-gray-900">Phone: +91 98765 43210 (9 AM - 9 PM)</p>
                </div>

            </div>
        </div>
    )
}
