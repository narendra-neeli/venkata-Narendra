import React, { useState, useRef, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Video, VideoOff, Mic, MicOff, Phone, 
  Monitor, MessageCircle, Users, Maximize2, Settings 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export default function VideoCall() {
  const { user } = useOutletContext();
  const [isCallActive, setIsCallActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [stream, setStream] = useState(null);
  const videoRef = useRef(null);

  const startCall = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setIsCallActive(true);
    } catch (err) {
      // Fallback to simulated call
      setIsCallActive(true);
    }
  };

  const endCall = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsCallActive(false);
    setIsMuted(false);
    setIsVideoOff(false);
  };

  const toggleMute = () => {
