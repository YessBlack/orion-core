import { describe, it, expect, vi, beforeEach } from "vitest"
import { renderHook, act } from "@testing-library/react"
import { useLoginForm } from "../hooks/useLoginForm"
import type { ChangeEvent, FormEvent } from "react"

vi.mock('../auth.store', () => ({
  useAuthStore: vi.fn()
}))

vi.mock('react-router-dom', () => ({
  useNavigate: vi.fn()
}))

import { useAuthStore } from '../auth.store'
import { useNavigate } from 'react-router-dom'

const mockLogin = vi.fn()
const mockNavigate = vi.fn()

beforeEach(() => {
  vi.clearAllMocks()
  vi.mocked(useAuthStore).mockImplementation((selector: unknown) =>
    (selector as (store: { login: typeof mockLogin }) => unknown)({ login: mockLogin })
  )
  vi.mocked(useNavigate).mockReturnValue(mockNavigate)
})

const setup = () => renderHook(() => useLoginForm())

const submit = (result: ReturnType<typeof setup>['result']) => {
  result.current.handleSubmit({
    preventDefault: vi.fn()
  } as unknown as FormEvent<HTMLFormElement>)
}

const change = (
  result: ReturnType<typeof setup>['result'],
  name: 'email' | 'password',
  value: string
) => {
  result.current.handleChange({
    target: { name, value }
  } as ChangeEvent<HTMLInputElement>)
}

const fill = (result: ReturnType<typeof setup>['result']) => {
  act(() => {
    change(result, 'email', 'test@test.com')
    change(result, 'password', '12345678')
  })
}

describe('useLoginForm', () => {
  describe('validate', () => {
    it('setea error si el email está vacío', () => {
      const { result } = setup()
      act(() => { submit(result) })
      expect(result.current.errors.email).toBe("Debe ser un email válido")
    })

    it('setea error si el email es inválido', () => {
      const { result } = setup()
      act(() => { change(result, 'email', 'invalid-email') })
      act(() => { submit(result) })
      expect(result.current.errors.email).toBe("Debe ser un email válido")
    })

    it('setea error si password tiene menos de 8 caracteres', () => {
      const { result } = setup()
      act(() => { change(result, 'password', 'short') })
      act(() => { submit(result) })
      expect(result.current.errors.password).toBe("Mínimo 8 caracteres")
    })
  })

  describe('handleChange', () => {
    it('actualiza el valor del campo correcto', () => {
      const { result } = setup()
      act(() => { change(result, 'email', 'test@test.com') })
      expect(result.current.values.email).toBe('test@test.com')
    })

    it('limpia el error del campo cuando el usuario escribe', () => {
      const { result } = setup()
      act(() => { submit(result) })
      expect(result.current.errors.email).toBeDefined()
      act(() => { change(result, 'email', 'algo') })
      expect(result.current.errors.email).toBeUndefined()
    })
  })

  describe('handleSubmit', () => {
    it('no llama a login si la validación falla', async () => {
      const { result } = setup()
      await act(async () => { submit(result) })
      expect(mockLogin).not.toHaveBeenCalled()
    })

    it('llama a login con los valores correctos', async () => {
      mockLogin.mockResolvedValue(undefined)
      const { result } = setup()
      fill(result)
      await act(async () => { submit(result) })
      expect(mockLogin).toHaveBeenCalledWith({
        email: 'test@test.com',
        password: '12345678'
      })
    })

    it('navega a /dashboard si login es exitoso', async () => {
      mockLogin.mockResolvedValue(undefined)
      const { result } = setup()
      fill(result)
      await act(async () => { submit(result) })
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard')
    })

    it('muestra error de servidor si login falla', async () => {
      mockLogin.mockRejectedValue(new Error('Unauthorized'))
      const { result } = setup()
      fill(result)
      await act(async () => { submit(result) })
      expect(result.current.errors.server).toBe('Credenciales incorrectas')
    })

    it('isSubmitting vuelve a false al terminar', async () => {
      mockLogin.mockResolvedValue(undefined)
      const { result } = setup()
      fill(result)
      await act(async () => { submit(result) })
      expect(result.current.isSubmitting).toBe(false)
    })
  })
})
