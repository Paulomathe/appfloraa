import { Redirect } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';

export default function Index() {
return <Redirect href="/signin/page"/>;
} 