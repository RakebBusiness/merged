import { Star, User, GraduationCap } from 'lucide-react';
import { Testimonial } from '../data/testimonials';

interface TestimonialCardProps {
  testimonial: Testimonial;
}

export default function TestimonialCard({ testimonial }: TestimonialCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-all duration-300">
      <div className="flex items-center space-x-3 mb-4">
        <div className={`p-3 rounded-full ${
          testimonial.role === 'student' ? 'bg-blue-100' : 'bg-green-100'
        }`}>
          {testimonial.role === 'student' ? (
            <User className={`w-6 h-6 ${
              testimonial.role === 'student' ? 'text-blue-600' : 'text-green-600'
            }`} />
          ) : (
            <GraduationCap className={`w-6 h-6 ${
              testimonial.role === 'student' ? 'text-blue-600' : 'text-green-600'
            }`} />
          )}
        </div>
        <div>
          <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
          <p className="text-sm text-gray-600 capitalize">{testimonial.role}</p>
        </div>
      </div>

      <p className="text-gray-700 text-sm mb-4 leading-relaxed">{testimonial.content}</p>

      <div className="flex space-x-1">
        {[...Array(5)].map((_, index) => (
          <Star
            key={index}
            className={`w-4 h-4 ${
              index < testimonial.rating
                ? 'text-yellow-400 fill-current'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
