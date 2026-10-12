export const BLOOD_GROUPS = ['A+', 'A−', 'B+', 'B−', 'AB+', 'AB−', 'O+', 'O−'];

// Every person and request in this file is fictional. No contact details are public.
export const sampleDonors = [
  { id: 'sample-donor-1', name: 'Aarav Mehta', bloodGroup: 'O+', city: 'Pune', available: true, initials: 'AM' },
  { id: 'sample-donor-2', name: 'Ananya Rao', bloodGroup: 'A+', city: 'Mumbai', available: true, initials: 'AR' },
  { id: 'sample-donor-3', name: 'Kabir Shah', bloodGroup: 'B+', city: 'Pune', available: true, initials: 'KS' },
  { id: 'sample-donor-4', name: 'Meera Joshi', bloodGroup: 'AB+', city: 'Delhi', available: false, initials: 'MJ' },
  { id: 'sample-donor-5', name: 'Vihaan Nair', bloodGroup: 'O−', city: 'Bengaluru', available: true, initials: 'VN' },
  { id: 'sample-donor-6', name: 'Isha Kapoor', bloodGroup: 'A−', city: 'Mumbai', available: true, initials: 'IK' },
  { id: 'sample-donor-7', name: 'Rohan Desai', bloodGroup: 'B−', city: 'Pune', available: false, initials: 'RD' },
  { id: 'sample-donor-8', name: 'Tara Menon', bloodGroup: 'AB−', city: 'Bengaluru', available: true, initials: 'TM' },
].map((donor) => ({ ...donor, availability: donor.available ? 'available' : 'unavailable', source: 'sample' }));

export const sampleRequests = [
  { id: 'sample-request-1', name: 'Aarohi (fictional)', bloodGroup: 'B+', city: 'Pune', hospital: 'Sample City Hospital', requiredDate: '2026-10-15', createdAt: '2026-10-10T08:00:00.000Z', source: 'sample' },
  { id: 'sample-request-2', name: 'Dev (fictional)', bloodGroup: 'O+', city: 'Mumbai', hospital: 'Demo Community Hospital', requiredDate: '2026-10-16', createdAt: '2026-10-09T08:00:00.000Z', source: 'sample' },
  { id: 'sample-request-3', name: 'Neha (fictional)', bloodGroup: 'A−', city: 'Bengaluru', hospital: 'Example Care Centre', requiredDate: '2026-10-18', createdAt: '2026-10-08T08:00:00.000Z', source: 'sample' },
];

export const DEMO_PROFILE = {
  name: 'Aarav Mehta',
  age: 24,
  bloodGroup: 'O+',
  city: 'Pune',
  email: 'aarav@example.com',
  phone: '+91 00000 00000',
  availability: 'available',
};

export const sampleBanks = [
  { id:'bank-1',name:'Example Community Blood Centre',city:'Pune',venue:'Sample Healthcare Campus',groups:['A+','B+','O+'],available:true,hours:'9 AM – 6 PM' },
  { id:'bank-2',name:'Demo Central Blood Bank',city:'Mumbai',venue:'Fictional Medical District',groups:['A−','AB+','O−'],available:true,hours:'8 AM – 8 PM' },
  { id:'bank-3',name:'Sample Care Blood Centre',city:'Delhi',venue:'Example Hospital Campus',groups:['B−','AB−'],available:false,hours:'9 AM – 5 PM' },
  { id:'bank-4',name:'Example Regional Blood Bank',city:'Bengaluru',venue:'Sample Community Campus',groups:['A+','O+','AB+'],available:true,hours:'8 AM – 6 PM' },
]
export const sampleCamps = [
  { id:'camp-1',name:'Community Kindness Drive',city:'Pune',venue:'Example Community Hall',date:'2026-11-14',time:'9 AM – 3 PM' },
  { id:'camp-2',name:'Campus Gives Together',city:'Mumbai',venue:'Sample College Campus',date:'2026-11-21',time:'10 AM – 4 PM' },
  { id:'camp-3',name:'A Day for Giving',city:'Bengaluru',venue:'Fictional Civic Centre',date:'2026-11-28',time:'9 AM – 2 PM' },
]
