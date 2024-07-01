import Stripe from 'stripe';
import { STRIPE_SECRET } from './env';

export const stripe = new Stripe(STRIPE_SECRET);
