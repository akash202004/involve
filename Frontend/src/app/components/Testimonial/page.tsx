import React from 'react'
import StarRatingTestimonial from '../ui/StarRatingTestimonial';


  const testimonials = [
  {
    image: 'https://via.placeholder.com/150',
    text: 'Using this component library has significantly speed up our development process. The quality and ease of integration are remarkable!',
    name: 'David Smith',
    jobtitle: 'UI Designer',
    rating: 2
  },
  {
    image: 'https://via.placeholder.com/150',
    text: 'I love  how intuitive and well-documented this component library is. It has significantly improved our UI consistency across projects.',
    name: 'James Wilson',
    jobtitle: 'Product Manager',
    rating: 2
  },
  {
    image: 'https://via.placeholder.com/150',
    text: 'Using this library has been a game-changer for our product development.',
    name: 'Michael Davis',
    jobtitle: 'Full Stack Developer',
    rating: 5
  },
  {
    image: 'https://via.placeholder.com/150',
    text: 'The components are highly responsive and work seamlessly across different devices and screen sizes.',
    name: 'Emily Chen',
    jobtitle: 'Mobile App Developer',
    rating: 5
  },
  {
    image: 'https://via.placeholder.com/150',
    text: 'This library has saved us a significant amount of time and effort. The components are well-documented and easy to integrate.',
    name: 'Sarah Taylor',
    jobtitle: 'Backend Developer',
    rating: 5
  },
  {
    image: 'https://via.placeholder.com/150',
    text: 'I appreciate the attention to detail in the design. The components are visually appealing and professional.',
    name: 'Kevin White',
    jobtitle: 'UI/UX Designer',
    rating: 5
  },
  {
    image: 'https://via.placeholder.com/150',
    text: 'The components are highly customizable and can be easily integrated with our existing UI framework.',
    name: 'Rachel Patel',
    jobtitle: 'Full Stack Developer',
    rating: 4
  },
  {
    image: 'https://via.placeholder.com/150',
    text: 'I love how the components are designed to be highly responsive and work well across different screen sizes.',
    name: 'Brian Kim',
    jobtitle: 'Mobile App Developer',
    rating: 5
  },
  
];


function page() {
  const displayedTestimonials = testimonials.slice(0, 4);

  return (
    <div className="w-full flex flex-col items-center justify-center pt-8 pb-8 px-2 sm:px-4 max-w-4xl mx-auto">
      <StarRatingTestimonial mode='light' testimonials={displayedTestimonials}/>
    </div>
  )
}

export default page;