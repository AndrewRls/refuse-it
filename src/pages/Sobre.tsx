import { ArrowRight, Building2, CircleCheck, HeartHandshake, Landmark, Leaf, Scale, Store, Wheat } from 'lucide-react'
import Button from '../components/Button'
import Reveal from '../components/Reveal'
import SectionTitle from '../components/SectionTitle'
import PageHeader from '../components/PageHeader'

const parceiros = [
  {
    icon: Store,
    titulo: 'Estabelecimentos',
    texto: 'Restaurantes, mercados, padarias e produtores publicam o que sobrou, em vez de descartar.',
  },
  {
    icon: HeartHandshake,
    titulo: 'Instituições sociais',
    texto: 'ONGs, abrigos e cozinhas comunitárias encontram alimentos perto de si e reservam o que precisam.',
  },
  {
    icon: Landmark,
    titulo: 'Organizações públicas',
    texto: 'Parcerias com o poder público ajudam a ampliar o alcance e a medir o impacto na comunidade.',
  },
]

const impacto = [
  'Cada entrega concluída soma ao indicador de alimento reaproveitado.',
  'O painel mostra o peso estimado, e itens contados por unidade aparecem à parte.',
  'Estabelecimentos e instituições acompanham o próprio impacto em tempo real.',
]

const ods = [
  { n: 2, icon: Wheat, titulo: 'Fome zero' },
  { n: 10, icon: Scale, titulo: 'Redução das desigualdades' },
  { n: 11, icon: Building2, titulo: 'Cidades sustentáveis' },
  { n: 12, icon: Leaf, titulo: 'Consumo responsável' },
]

export default function Sobre() {
  return (
    <>
            <PageHeader
        titulo="Recusar o desperdício é o primeiro passo"
        rotulo="Sobre"
        descricao="O Refuse It é uma plataforma de redistribuição de alimentos que liga quem tem comida sobrando a quem precisa dela."
      />

      {/* Problema e resposta */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-6 md:grid-cols-2">
          <Reveal className="h-full">
            <div className="h-full rounded-3xl bg-white p-8 ring-1 ring-brand-100">
              <p className="text-xs font-bold tracking-widest text-red-700 uppercase">O problema</p>
              <p className="mt-4 text-lg leading-relaxed text-ink/80">
                Restaurantes, mercados e pequenos produtores descartam alimentos que poderiam ser aproveitados, enquanto
                diversas comunidades enfrentam dificuldades de acesso à alimentação.
              </p>
            </div>
          </Reveal>
          <Reveal delay={100} className="h-full">
            <div className="h-full rounded-3xl bg-linear-to-br from-brand-900 to-brand-700 p-8 text-white">
              <p className="text-xs font-bold tracking-widest text-brand-100 uppercase">A nossa resposta</p>
              <p className="mt-4 text-lg leading-relaxed text-white/90">
                Conectamos estabelecimentos comerciais, produtores e instituições sociais para facilitar a redistribuição
                de alimentos que seriam descartados, mas ainda estão próprios para consumo.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* O nome */}
      <section className="bg-brand-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal>
            <SectionTitle
              eyebrow="O nome"
              title="Duas pronúncias, dois significados"
              subtitle="“Refuse It” funciona nas duas leituras: “recuse isso” e “isso é lixo”. A marca é uma atitude e também um alerta sobre o que a gente descarta."
            />
          </Reveal>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <Reveal className="h-full">
              <div className="h-full rounded-3xl bg-white p-8 ring-1 ring-brand-100">
                <p className="text-3xl font-extrabold text-brand-900">ri-FIUZ</p>
                <p className="mt-1 text-sm font-bold text-brand-700">verbo</p>
                <p className="mt-4 text-ink/70">Recusar, dizer não.</p>
              </div>
            </Reveal>
            <Reveal delay={100} className="h-full">
              <div className="h-full rounded-3xl bg-white p-8 ring-1 ring-brand-100">
                <p className="text-3xl font-extrabold text-brand-900">RÉ-fiuss</p>
                <p className="mt-1 text-sm font-bold text-brand-700">substantivo</p>
                <p className="mt-4 text-ink/70">Lixo, resíduos.</p>
              </div>
            </Reveal>
          </div>

          <Reveal>
            <div className="mt-10 grid gap-8 lg:grid-cols-2">
              <div>
                <h2 className="text-xl">A origem no desperdício zero</h2>
                <p className="mt-3 leading-relaxed text-ink/70">
                  “Refuse” é o primeiro dos 5 Rs do estilo de vida zero waste: Refuse (recusar), Reduce (reduzir), Reuse
                  (reutilizar), Recycle (reciclar) e Rot (compostar). O nome coloca em primeiro plano a ideia mais poderosa
                  do movimento: o melhor resíduo é o que nunca chega a ser gerado.
                </p>
              </div>
              <div>
                <h2 className="text-xl">O “It”</h2>
                <p className="mt-3 leading-relaxed text-ink/70">
                  O “It” torna o nome pessoal e prático. Não é um conceito abstrato, é um convite a agir sobre coisas
                  concretas. Também deixa o nome curto, rítmico e fácil de lembrar, com tom de comando amigável.
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal>
            <p className="mt-10 rounded-3xl bg-brand-900 p-8 text-center text-xl font-bold text-white">
              Refuse (verbo): dizer não. Refuse (substantivo): lixo.{' '}
              <span className="text-brand-500">Refuse It: diga não ao lixo.</span>
            </p>
          </Reveal>
        </div>
      </section>

      {/* Impacto */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <Reveal>
            <SectionTitle
              eyebrow="Diferencial"
              title="Impacto que dá para medir"
              subtitle="Além de reduzir o desperdício, a plataforma mensura o impacto social e ambiental pela quantidade de alimentos reaproveitados."
            />
          </Reveal>
          <Reveal delay={100}>
            <ul className="space-y-4">
              {impacto.map((t) => (
                <li key={t} className="flex gap-3 rounded-2xl bg-white p-5 text-sm leading-relaxed text-ink/70 ring-1 ring-brand-100">
                  <CircleCheck size={20} className="mt-0.5 shrink-0 text-brand-500" />
                  {t}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* Modelo de negócio */}
      <section className="bg-brand-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal>
            <SectionTitle
              center
              eyebrow="Modelo de negócio"
              title="Uma rede construída com parcerias"
              subtitle="O Refuse It funciona quando três grupos trabalham juntos."
            />
          </Reveal>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {parceiros.map((p, i) => (
              <Reveal key={p.titulo} delay={i * 80} className="h-full">
                <div className="h-full rounded-3xl bg-white p-7 ring-1 ring-brand-100 transition duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-brand-900/10">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-100 text-brand-700">
                    <p.icon size={24} />
                  </span>
                  <h3 className="mt-5 text-lg">{p.titulo}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink/70">{p.texto}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ODS */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <Reveal>
          <SectionTitle center eyebrow="Compromisso" title="Objetivos de Desenvolvimento Sustentável" />
        </Reveal>
        <ul className="mt-10 flex flex-wrap justify-center gap-4">
          {ods.map((o) => (
            <li key={o.n} className="flex items-center gap-3 rounded-full bg-white py-2 pr-6 pl-2 ring-1 ring-brand-100">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-700 font-extrabold text-white">{o.n}</span>
              <o.icon size={18} className="text-brand-500" />
              <span className="text-sm font-bold text-brand-900">{o.titulo}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal>
          <div className="rounded-3xl bg-linear-to-br from-brand-900 to-brand-700 px-6 py-12 text-center text-white">
            <h2 className="text-3xl text-white">Faça parte dessa rede</h2>
            <p className="mx-auto mt-3 max-w-xl text-brand-100">Cadastre seu estabelecimento ou sua instituição e comece hoje.</p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Button to="/cadastro" variant="secondary">Criar conta</Button>
              <Button to="/doacoes" variant="ghost" className="text-white hover:bg-white/10 hover:text-white">
                Ver o catálogo <ArrowRight size={18} />
              </Button>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  )
}