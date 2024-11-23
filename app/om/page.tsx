"use client";

import { getNumberOfCurrentMembers } from "@/lib/utils/getRelevantMembers";
import { getNumberOfProjects } from "@/lib/utils/projectUtils";
import { motion } from "framer-motion";
import { HiOutlineSparkles } from "react-icons/hi2";
import { MdGroups2 } from "react-icons/md";
import { FaBoxOpen } from "react-icons/fa";
import { PiPlant } from "react-icons/pi";
import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="min-h-screen text-white">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="mb-16 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl"
          >
            <HiOutlineSparkles className="mr-2 hidden sm:inline-block h-8 w-8 text-onlineOrange" />
            Applikasjonskomiteen
            <HiOutlineSparkles className="ml-2 hidden sm:inline-block h-8 w-8 text-onlineOrange" />
          </motion.h1>
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-12 lg:grid-cols-2">
          {/* Left Column - Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="space-y-8"
          >
            <div className="rounded-xl bg-gray-900/50 p-6 backdrop-blur">
              <h2 className="mb-4 text-2xl font-semibold text-onlineOrange">Om Appkom</h2>
              <p className="text-gray-300">
                Applikasjonskomiteen (Appkom) er en komité under Online, linjeforeningen for informatikk ved NTNU.
                Vårt mål er å utvikle programvare som er nyttig for informatikkstudenter.
              </p>
            </div>

            <div className="rounded-xl bg-gray-900/50 p-6 backdrop-blur">
              <h2 className="mb-4 text-2xl font-semibold text-onlineOrange">Våre Prosjekter</h2>
              <p className="text-gray-300">
                For å nevne noen har har vi tidligere utviklet <b>Online-appen</b>, <b>Infoskjermen på A4</b>, <b>Onlinefondet.no</b>, <b>Komitéopptaksystemet</b>, <b>Autobank</b> og diverse <b>spill</b>. Vi jobber for tiden med å fullføre flere prosjekter samt vedlikeholde og forberede våre lanserte prosjekter.
                Vi er alltid på utkikk etter å starte opp noe nytt og spennende, og setter stor pris på nye ideer.
              </p>
            </div>

            <div className="rounded-xl bg-gray-900/50 p-6 backdrop-blur">
              <h2 className="mb-4 text-2xl font-semibold text-onlineOrange">Bli Med i Appkom</h2>
              <p className="text-gray-300">
                Er du interessert i å bli med på våre spennende prosjekter, eller har du lyst til å starte opp ditt
                eget prosjekt? Appkom er stedet for deg! Vi krever ikke forhåndskunnskaper, det er kun viktig at du er
                engasjert og viser initiativ. Har du noen spørsmål underveis, er det bare å spørre din progge-fadder,
                som vil være din mentor i oppstarten.
              </p>
            </div>
          </motion.div>

          {/* Right Column */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="space-y-8"
          >
            {/* Image */}
              <Image
                src="/diverse/julebord2024.JPG"
                alt="Appkom medlemmer"
                width={900}
                height={600}
                className="mx-auto w-full rounded-xl object-contain"
              />

            {/* Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl bg-gray-900/50 p-6 text-center backdrop-blur">
                <MdGroups2 className="mx-auto mb-2 h-8 w-8 text-onlineOrange" />
                <div className="text-3xl font-bold text-onlineOrange">{getNumberOfCurrentMembers()}</div>
                <div className="mt-2 text-sm text-gray-400">Medlemmer</div>
              </div>
              <div className="rounded-xl bg-gray-900/50 p-6 text-center backdrop-blur">
                <FaBoxOpen className="mx-auto mb-2 h-8 w-8 text-onlineOrange" />
                <div className="text-3xl font-bold text-onlineOrange">{getNumberOfProjects()}</div>
                <div className="mt-2 text-sm text-gray-400">Aktive Prosjekter</div>
              </div>
              <div className="rounded-xl bg-gray-900/50 p-6 text-center backdrop-blur">
                <PiPlant className="mx-auto mb-2 h-8 w-8 text-onlineOrange" />
                <div className="text-3xl font-bold text-onlineOrange">{new Date().getFullYear() - 2020}</div>
                <div className="mt-2 text-sm text-gray-400">År gammel komité</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-16 text-center"
        >
          <div className="inline-block rounded-xl w-full bg-onlineOrange p-8">
            <h2 className="mb-4 text-2xl font-bold text-gray-900">Interessert i å bli medlem?</h2>
            <p className="mb-6 text-gray-800">
              Søk Appkom under neste komitéopptak :)
            </p>
            <a
              href="https://opptak.online.ntnu.no/"
              target="_blank"
              className="inline-block rounded-lg bg-gray-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-gray-800"
            >
              Online Opptak
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
