import { createLazyFileRoute } from '@tanstack/react-router'
import VerifyOtp from '../pages/VerifyOtp';

export const Route = createLazyFileRoute('/verifyOtp')({
  component: VerifyOtp,
});