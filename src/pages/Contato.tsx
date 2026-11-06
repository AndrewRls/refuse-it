import { useMemo, useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { CircleCheck, Mail, Send } from 'lucide-react'
import Button from '../components/Button'
import FormField from '../components/FormField'
import { EMAIL_CONTATO } from '../data/site'
import { emailValido } from '../utils/forms'
import { inputClasses } from '../utils/styles'

type Elemento = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement

interface Valores {
  nome: string
  email: string
  assunto: string
  mensagem: string
}

type Erros = Partial<Record<keyof Valores, string>>

const assuntos = ['Dúvida', 'Quero doar', 'Represento uma instituição', 'Parceria', 'Sugestão ou problema']
const inicial: Valores = { nome: '', email: '', assunto: '', mensagem: '' }

function validar(v: Valores): Erros {
  const e: Erros = {}
  if (!v.nome.trim()) e.nome = 'Informe seu nome.'
  if (!v.email.trim()) e.email = 'Informe seu e-mail.'
  else if (!emailValido(v.email.trim())) e.email = 'Informe um e-mail válido.'
  if (!v.assunto) e.assunto = 'Selecione o assunto.'
  if (!v.mensagem.trim()) e.mensagem = 'Escreva sua mensagem.'
  else if (v.mensagem.trim().length < 10) e.mensagem = 'Escreva pelo menos 10 caracteres.'
  else if (v.mensagem.length > 1000) e.mensagem = 'Use no máximo 1000 caracteres.'
  return e
}

export default function Contato() {
  const [valores, setValores] = useState<Valores>(inicial)
  const [tocados, setTocados] = useState<Partial<Record<keyof Valores, boolean>>>({})
  const [tentou, setTentou] = useState(false)
  const [enviado, setEnviado] = useState(false)

  const erros = useMemo(() => validar(valores), [valores])

  function erroDe(campo: keyof Valores) {
    return tentou || tocados[campo] ? erros[campo] : undefined
  }

  function campo(id: keyof Valores) {
    const erro = erroDe(id)
    return {
      id,
      value: valores[id],
      onChange: (e: ChangeEvent<Elemento>) => setValores((v) => ({ ...v, [id]: e.target.value })),
      onBlur: () => setTocados((t) => ({ ...t, [id]: true })),
      'aria-invalid': Boolean(erro),
      'aria-describedby': erro ? `${id}-erro` : undefined,
      className: inputClasses(Boolean(erro)),
    }
  }

  function enviar(ev: FormEvent) {
    ev.preventDefault()
    setTentou(true)

    const primeiro = Object.keys(erros)[0]
    if (primeiro) {
      document.getElementById(primeiro)?.focus()
      return
    }

    const corpo = `${valores.mensagem.trim()}\n\n---\n${valores.nome.trim()}\n${valores.email.trim()}`
    const assunto = encodeURIComponent(`[Refuse It] ${valores.assunto}`)
    window.location.href = `mailto:${EMAIL_CONTATO}?subject=${assunto}&body=${encodeURIComponent(corpo)}`
    setEnviado(true)
  }

  function reiniciar() {
    setValores(inicial)
    setTocados({})
    setTentou(false)
    setEnviado(false)
  }

  return (
    <>
      <section className="bg-linear-to-b from-brand-50 to-white">
        <div className="mx-auto max-w-7xl px-4 pt-14 pb-8 sm:px-6">
          <p className="text-xs font-bold tracking-widest text-brand-700 uppercase">Contato</p>
          <h1 className="mt-2 text-3xl sm:text-4xl">Fale com a equipe</h1>
          <p className="mt-3 max-w-2xl text-ink/70">Dúvidas, ideias ou interesse em ser parceiro? Escreva para nós.</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-8 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-3">
          {enviado ? (
            <div role="status" className="rounded-3xl bg-brand-50 p-10 text-center ring-1 ring-brand-100 lg:col-span-2">
              <CircleCheck className="mx-auto text-brand-700" size={52} />
              <h2 className="mt-4 text-2xl">Quase lá!</h2>
              <p className="mx-auto mt-3 max-w-md text-ink/70">
                Abrimos o seu aplicativo de e-mail com a mensagem pronta. É só enviar por lá. Se nada abriu, escreva
                diretamente para{' '}
                <a href={`mailto:${EMAIL_CONTATO}`} className="font-bold text-brand-700 underline">
                  {EMAIL_CONTATO}
                </a>
                .
              </p>
              <div className="mt-8 flex justify-center">
                <Button variant="secondary" onClick={reiniciar}>Escrever outra mensagem</Button>
              </div>
            </div>
          ) : (
            <form
              onSubmit={enviar}
              noValidate
              className="space-y-6 rounded-3xl bg-white p-6 ring-1 ring-brand-100 sm:p-8 lg:col-span-2"
            >
              <div className="grid gap-6 sm:grid-cols-2">
                <FormField id="nome" label="Nome" required error={erroDe('nome')}>
                  <input {...campo('nome')} type="text" autoComplete="name" maxLength={120} />
                </FormField>
                <FormField id="email" label="E-mail" required error={erroDe('email')}>
                  <input {...campo('email')} type="email" autoComplete="email" maxLength={150} />
                </FormField>
              </div>

              <FormField id="assunto" label="Assunto" required error={erroDe('assunto')}>
                <select {...campo('assunto')}>
                  <option value="">Selecione...</option>
                  {assuntos.map((a) => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
              </FormField>

              <FormField
                id="mensagem"
                label="Mensagem"
                required
                error={erroDe('mensagem')}
                hint={`${valores.mensagem.length}/1000 caracteres`}
              >
                <textarea {...campo('mensagem')} rows={6} />
              </FormField>

              {tentou && Object.keys(erros).length > 0 && (
                <p role="alert" className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                  Corrija os campos destacados para continuar.
                </p>
              )}

              <Button type="submit" className="w-full sm:w-auto">
                <Send size={18} /> Enviar mensagem
              </Button>
            </form>
          )}

          <aside className="h-fit rounded-3xl bg-brand-50 p-6 ring-1 ring-brand-100">
            <p className="flex items-center gap-2 text-base font-bold text-brand-900">
              <Mail size={20} className="text-brand-700" /> Outras formas
            </p>
            <p className="mt-3 text-sm text-ink/70">
              Escreva direto para{' '}
              <a href={`mailto:${EMAIL_CONTATO}`} className="font-bold break-all text-brand-700 underline">
                {EMAIL_CONTATO}
              </a>
              .
            </p>
            <p className="mt-4 text-sm text-ink/70">
              Antes de escrever, vale conferir as{' '}
              <a href="/faq" className="font-bold text-brand-700 underline">perguntas frequentes</a>: sua dúvida pode já estar respondida.
            </p>
          </aside>
        </div>
      </section>
    </>
  )
}