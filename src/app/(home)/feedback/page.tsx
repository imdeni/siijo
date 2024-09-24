'use client'

import Rating from '@/components/elements/rating/page'
import axios from '@/lib/axios'
import useForm from '@/lib/useform'
import { Button, Card, CardBody, Input, Skeleton, Textarea, button } from '@nextui-org/react'
import { useSession } from 'next-auth/react'
import React from 'react'
import { useFormStatus } from 'react-dom'
import toast from 'react-hot-toast'

export default function Feedback() {
    const { data: session, status } = useSession()
    const [loading, setLoading] = React.useState(true)
    const [buttonLoading, setButtonLoading] = React.useState(false)
    const [rating, setRating] = React.useState([])
    const [activeClass, setActiveClass] = React.useState(null)
    const [edited, setEdited] = React.useState(null)

    React.useEffect(() => {
        if (status === 'authenticated') {
            getActiveClass()
        }
    }, [status])

    React.useEffect(() => {
        if (activeClass) {
            getRating()
        }
    }, [activeClass])

    const getRating = async () => {
        setLoading(true)
        await axios.post('participant/feedback/list-questions', {
            participant_id: session?.user?.participant_id,
            training_schedule_id: activeClass?.trx_training_schedule?.id,
            training_code: activeClass?.trx_training_schedule?.training_code
        })
            .then(async (response: any) => {
                setRating(response?.data?.feedback)
            }).catch((error: any) => {
            })
        setLoading(false)
    }

    const getActiveClass = async () => {
        setLoading(true)
        await axios.post('participant/training/get-active-classes', {
            participant_id: session?.user?.participant_id
        }).then(async (response: any) => {
            setActiveClass(response?.data?.active_training)
        }).catch((error: any) => {
        })
        setLoading(false)
    }

    const onChangeRating = async (value: number, categoryIndex: number, questionIndex: number) => {
        const newRating = [...rating]
        newRating[categoryIndex].questions[questionIndex].answer = value
        setRating(newRating)

        let form = {
            id_question: newRating[categoryIndex].questions[questionIndex].id,
            participant_id: session?.user?.participant_id,
            training_schedule_id: activeClass?.trx_training_schedule?.id,
            training_code: activeClass?.trx_training_schedule?.training_code,
            answer: newRating[categoryIndex].questions[questionIndex].answer
        }

        await axios.post('participant/feedback/update-feedback', form).then((response: any) => {
            toast.success(response?.meta?.message ?? 'Berhasil mengirim feedback')
        }).catch((error: any) => {
            toast.error(error?.response?.data?.meta?.message ?? 'Terjadi kesalahan saat mengirim feedback')
        })
    }

    const onChangeText = async (value: string, categoryIndex: number, questionIndex: number) => {
        value ? setEdited({ categoryIndex, questionIndex }) : setEdited(null)
        const newRating = [...rating]
        newRating[categoryIndex].questions[questionIndex].answer = value
        setRating(newRating)
    }

    const onSubmit = async (categoryIndex: number, questionIndex: number) => {
        setButtonLoading(true)
        await axios.post('participant/feedback/update-feedback', {
            id_question: rating[categoryIndex].questions[questionIndex].id,
            participant_id: session?.user?.participant_id,
            training_schedule_id: activeClass?.trx_training_schedule?.id,
            training_code: activeClass?.trx_training_schedule?.training_code,
            answer: rating[categoryIndex].questions[questionIndex].answer
        }).then((response: any) => {
            toast.success(response?.meta?.message ?? 'Berhasil mengirim feedback')
        }).catch((error: any) => {
            toast.error(error?.response?.data?.meta?.message ?? 'Terjadi kesalahan saat mengirim feedback')
        })
        setButtonLoading(false)
        setEdited(null)
    }

    return (
        <div>
            {loading ? (
                <div className="space-y-4">
                    {[...Array(3)].map((_, index) => (
                        <Skeleton key={index} className='rounded-xl h-64' />
                    ))}
                </div>
            ) : (
                activeClass ? (
                    <>
                        <h1 className='mb-2 font-medium text-default-400 text-xl'>Feedback</h1>
                        <div className="space-y-4">
                            {rating.map((category: any, categoryIndex: number) => (
                                <Card key={category?.indicator_id}>
                                    <CardBody className='p-5'>
                                        <h1 className='mx-auto mb-2 font-medium text-default-600 text-lg'>{category?.indicator}</h1>
                                        <div className='space-y-2 mb-3'>
                                            {category?.questions.map((question: any, questionIndex: number) => (
                                                question?.question_type == 'star' ? (
                                                    <div key={question?.id} className='flex flex-row justify-between gap-5'>
                                                        <p className='text-balance text-default-400 text-sm md:text-medium leading-6'>{question?.question}</p>
                                                        <Rating size='2xl' value={parseInt(question?.answer ?? 0)} onValueChange={value => onChangeRating(value, categoryIndex, questionIndex)} />
                                                    </div>
                                                ) : (
                                                    <div key={question?.id} className='flex flex-col gap-3'>
                                                        <Textarea label='Kritik atau saran' onValueChange={value => onChangeText(value, categoryIndex, questionIndex)} value={question?.answer} />
                                                        {edited?.categoryIndex === categoryIndex && edited?.questionIndex === questionIndex && (
                                                            <Button className='ml-auto' size='sm' color='primary' isLoading={buttonLoading} onPress={() => onSubmit(categoryIndex, questionIndex)}>Simpan</Button>
                                                        )}
                                                    </div>
                                                )
                                            ))}
                                        </div>
                                    </CardBody>
                                </Card>
                            ))}
                        </div>
                    </>
                ) : (
                    <Card>
                        <CardBody className='p-5'>
                            <p className="mx-auto text-default-400 text-sm">Anda tidak tergabung dalam kelas manapun.</p>
                        </CardBody>
                    </Card>
                )
            )}
        </div >
    )
}

