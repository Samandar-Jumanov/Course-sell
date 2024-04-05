"use client";

import React from 'react';
import Slider from 'react-slick';
import Image from 'next/image';
import Rating from 'react-rating-stars-component';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { commonCourses } from './courses';

export const MostCommonCourses = () => {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
    };

    return (
        <div className="my-2 mx-auto max-w-7xl p-6  bg-slate-700">
            <Slider {...settings}>
                {commonCourses.map((course) => (
                    <div key={course.id} className=" text-white flex flex-col items-center  bg-slate-900 rounded-lg overflow-hidden shadow-lg text-center py-6 px-4">
                        {/* Image container for more control */}
                        <div className="w-full flex justify-center mb-4">
                            <Image src={course.image} alt="Course Image" width={400} height={400} objectFit="cover" className="rounded-lg"/>
                        </div>
                        <div className="text-lg font-bold ">Members: {course.members}</div>
                          <div className='w-full flex justify-center mb-4'>
                           <Rating value={course.rate} edit={false} size={24} activeColor="#ffd700" className="mb-2"/>
                             
                          </div>
                        <p className=" text-base lg:text-lg mb-2">{course.description}</p>
                        <div className="text-sm">Date: {course.date}</div>
                    </div>
                ))}
            </Slider>
        </div>
    );
};
