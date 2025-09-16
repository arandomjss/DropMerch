import React from "react";
import { FaUsers, FaPaintBrush, FaCheckCircle, FaUniversity, FaRocket } from "react-icons/fa";

export default function About() {
  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <div className="bg-gradient-to-br from-genzPurple via-genzBlue to-genzPink rounded-2xl shadow-xl p-8 text-white">
        <h1 className="text-4xl font-extrabold mb-4 text-center drop-shadow">About DropMerch</h1>
        <p className="text-lg mb-6 text-center">
          <span className="font-semibold text-genzYellow">DropMerch</span> is a Gen Z-inspired platform for campus merch drops, powered by student creativity and community collaboration.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="flex flex-col items-center">
            <FaPaintBrush className="text-5xl mb-2 text-genzPink drop-shadow" />
            <h2 className="text-xl font-bold mb-1">Design Studio</h2>
            <p className="text-center text-base">
              Create, save, and submit your own merch designs. Use our interactive studio with drawing, shapes, color palettes, and draft saving. Your creativity drives the campus culture!
            </p>
          </div>
          <div className="flex flex-col items-center">
            <FaCheckCircle className="text-5xl mb-2 text-genzBlue drop-shadow" />
            <h2 className="text-xl font-bold mb-1">Admin Approval</h2>
            <p className="text-center text-base">
              Every design goes through a transparent approval process. Our admins ensure quality and authenticity before your merch hits the shop.
            </p>
          </div>
          <div className="flex flex-col items-center">
            <FaUniversity className="text-5xl mb-2 text-genzYellow drop-shadow" />
            <h2 className="text-xl font-bold mb-1">Campus Connection</h2>
            <p className="text-center text-base">
              Connect with your university, discover exclusive drops, and represent your campus with pride. Merch drops are tailored for your community!
            </p>
          </div>
          <div className="flex flex-col items-center">
            <FaUsers className="text-5xl mb-2 text-genzPurple drop-shadow" />
            <h2 className="text-xl font-bold mb-1">Collaborative Community</h2>
            <p className="text-center text-base">
              Vote, comment, and support your friends’ designs. DropMerch is built for collaboration, feedback, and celebrating student talent.
            </p>
          </div>
        </div>
        <div className="flex flex-col items-center mt-8">
          <FaRocket className="text-5xl mb-2 text-white drop-shadow" />
          <h2 className="text-2xl font-bold mb-2">Our Mission</h2>
          <p className="text-center text-base max-w-xl">
            DropMerch empowers students to turn ideas into real merch, build campus identity, and launch creative careers. We believe in the power of youth, design, and community.
          </p>
        </div>
      </div>
      <div className="mt-8 text-center text-genzGray-700">
        <p>
          Made with <span className="text-genzPink font-bold">♥</span> by the DropMerch Team.<br />
          <span className="italic">Dream it. Design it. Drop it.</span>
        </p>
      </div>
    </div>
  );
}