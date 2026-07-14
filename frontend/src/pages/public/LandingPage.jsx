import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  FiHeart,
  FiTruck,
  FiUsers,
  FiArrowRight,
  FiPackage,
  FiShield,
  FiZap
} from "react-icons/fi";

const features = [
  {
    icon: FiPackage,
    title: "Easy Donations",
    desc: "Donors list surplus food in seconds with photos, quantity, and pickup details.",
    color: "from-primary-500 to-primary-600"
  },
  {
    icon: FiUsers,
    title: "NGO Network",
    desc: "Verified NGOs browse available donations and coordinate pickups efficiently.",
    color: "from-accent-500 to-accent-600"
  },
  {
    icon: FiTruck,
    title: "Real-Time Tracking",
    desc: "Follow every delivery live on a map with GPS updates from volunteers.",
    color: "from-blue-500 to-blue-600"
  },
  {
    icon: FiShield,
    title: "Verified & Secure",
    desc: "Multi-role access control with JWT auth, NGO verification, and audit logs.",
    color: "from-violet-500 to-violet-600"
  },
  {
    icon: FiZap,
    title: "Instant Notifications",
    desc: "Socket.IO and Firebase push notifications keep everyone updated instantly.",
    color: "from-amber-500 to-amber-600"
  },
  {
    icon: FiHeart,
    title: "Impact Analytics",
    desc: "Track meals served, food waste prevented, and environmental impact.",
    color: "from-rose-500 to-rose-600"
  }
];


const LandingPage = () => {
  const [stats, setStats] = useState({
    totalDonations: 0,
    totalNGOs: 0,
    mealsDelivered: 0,
    co2Saved: 0
});useEffect(() => {

        axios
            .get("http://localhost:5000/api/public/stats")
            .then((res) => {

                setStats(res.data);

            })
            .catch(console.error);

    }, []);

    const statCards = [
        {
            label: "Donations Made",
            value: stats.totalDonations
        },
        {
            label: "Partner NGOs",
            value: stats.totalNGOs
        },
        {
            label: "Meals Delivered",
            value: stats.mealsDelivered
        },
        {
            label: "CO₂ Saved (kg)",
            value: stats.co2Saved
        }
    ];
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-emerald-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-glow">
            <FiHeart className="text-white" size={17} />
          </div>
          <span className="font-display font-extrabold text-xl text-slate-900 dark:text-white">
            NourishNet
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/login" className="btn-ghost text-sm">Sign In</Link>
          <Link to="/register" className="btn-primary text-sm">Get Started</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="text-center px-6 pt-16 pb-20 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-100 dark:bg-primary-950/40 text-primary-700 dark:text-primary-300 px-3.5 py-1.5 text-xs font-semibold mb-5">
            <FiHeart size={12} /> Food Donation & Distribution Platform
          </span>
          <h1 className="text-5xl sm:text-6xl font-display font-extrabold text-slate-900 dark:text-white leading-tight">
            Share Food,{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-accent-500">
              Nourish Lives
            </span>
          </h1>
          <p className="mt-5 text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
            NourishNet connects food donors, NGOs, and volunteers through a
            real-time platform that ensures surplus food reaches those who need
            it — tracked every step of the way.
          </p>
          <div className="mt-8 flex items-center justify-center gap-4 flex-wrap">
            <Link to="/register" className="btn-primary gap-2 text-base px-7 py-3">
              Join the Network <FiArrowRight size={18} />
            </Link>
            <Link to="/donations" className="btn-outline text-base px-7 py-3">
              Browse Donations
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Stats */}
      <section className="max-w-5xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {statCards.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i, duration: 0.35 }}
              className="card p-5 text-center"
            >
              <p className="text-3xl font-display font-extrabold text-slate-900 dark:text-white">
                {s.value}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                {s.label}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <h2 className="section-title text-center mb-10">
          Everything you need to redistribute food at scale
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 * i }}
              className="card card-hover p-6"
            >
              <div
                className={`w-11 h-11 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center text-white mb-4`}
              >
                <f.icon size={20} />
              </div>
              <h3 className="font-display font-bold text-slate-900 dark:text-white">
                {f.title}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                {f.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-3xl mx-auto px-6 pb-20 text-center">
        <div className="card p-10 bg-gradient-to-br from-primary-500 to-accent-600 text-white">
          <h2 className="text-3xl font-display font-extrabold">
            Ready to make a difference?
          </h2>
          <p className="text-white/80 mt-3">
            Join hundreds of donors, NGOs, and volunteers already on NourishNet.
          </p>
          <Link
            to="/register"
            className="btn bg-white text-primary-600 font-bold px-8 py-3 mt-6 hover:bg-orange-50 shadow-lg"
          >
            Get Started Free
          </Link>
        </div>
      </section>

      <footer className="text-center py-6 text-sm text-slate-400">
        &copy; {new Date().getFullYear()} NourishNet. Built to reduce food waste.
      </footer>
    </div>
  );
};

export default LandingPage;
