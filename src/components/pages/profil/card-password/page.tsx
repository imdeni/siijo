import ButtonSubmit from '@/components/elements/button-submit/page'
import axios from '@/lib/axios'
import useForm from '@/lib/useform'
import { Card, CardBody, Input } from '@nextui-org/react'
import { useSession } from 'next-auth/react'
import React from 'react'
import toast from 'react-hot-toast'

export default function CardPassword() {
    const { data: session, status } = useSession()
    const reset = React.useRef(null)
    const [showPassword, setShowPassword] = React.useState(false)
    const [error, setError] = useForm({
        password_new: null,
        password_confirm: null
    })

    const handleUpdatePassword = async (formData: FormData) => {
        setError('reset')
        let isValid = true

        if (!formData.get('password_new')) {
            isValid = false
            setError('password_new', 'Password baru tidak boleh kosong.')
        }
        if (!formData.get('password_confirm')) {
            isValid = false
            setError('password_confirm', 'Konfirmasi password tidak boleh kosong.')
        }
        if (formData.get('password_new') !== formData.get('password_confirm')) {
            isValid = false
            setError('password_confirm', 'Password tidak sama.')
        }

        isValid && await axios.post('/participant/account/update_profile', {
            name: session?.user?.name,
            email: session?.user?.email,
            phone_number: session?.user?.phone_nummber,
            password: formData.get('password_confirm')
        })
            .then((response) => {
                reset?.current?.click()
                toast.success(response?.meta?.message)
            }).catch((error) => {
                toast.error(error?.response?.data?.meta?.message)
            })
    }
    return (
        <Card>
            <CardBody className='p-5'>
                <form action={handleUpdatePassword}>
                    <h1 className='mx-auto mb-2 font-medium text-default-600 text-lg'>Ubah Password</h1>
                    <div className='space-y-5 mb-5'>
                        {/* <Input name='password_old' label='Password lama' /> */}
                        <Input isInvalid={error.password_new ? true : false} errorMessage={error.password_new} name='password_new' type={showPassword ? 'text' : 'password'} label='Password Baru' endContent={
                            <button className="focus:outline-none" type="button" onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? (
                                    <span className="text-default-400 text-xl mdi mdi-eye-off"></span>
                                ) : (
                                    <span className="text-default-400 text-xl mdi mdi-eye"></span>
                                )}
                            </button>
                        } />
                        <Input isInvalid={error.password_confirm ? true : false} errorMessage={error.password_confirm} name='password_confirm' type='password' label='Konfirmasi Password Baru' />
                    </div>
                    <ButtonSubmit label='Update Password' />
                    <button type="reset" hidden ref={reset} />
                </form>
            </CardBody>
        </Card>
    )
}
