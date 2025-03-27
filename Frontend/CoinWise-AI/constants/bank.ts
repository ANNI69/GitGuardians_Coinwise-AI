export interface Bank {
  id: string;
  name: string;
  logo: any; // Use require() for local images
  primaryColor: string;
}

export const banks: Bank[] = [
  {
    id: 'hdfc',
    name: 'HDFC Bank',
    logo: require('../assets/images/bank.png'),
    primaryColor: '#004B93',
  },
  {
    id: 'icici',
    name: 'ICICI Bank',
    logo: require('../assets/images/bank.png'),
    primaryColor: '#FF6F61',
  },
];