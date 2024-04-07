import { createLazyFileRoute } from '@tanstack/react-router'
import Signup from '../pages/Signup';

export const Route = createLazyFileRoute('/signup')({
  component: Signup,
});