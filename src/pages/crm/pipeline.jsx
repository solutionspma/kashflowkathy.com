import React, { useEffect, useState } from 'react'
import { requireAuth, getUser, logout } from '@/middleware/auth'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { TEST_STAGES, TEST_DEALS, TEST_CONTACTS, formatCurrency } from '@/lib/testData'

export default function Pipeline() {
  const [user, setUser] = useState(null)
  const [stages, setStages] = useState(TEST_STAGES)
  const [deals, setDeals] = useState(
    TEST_STAGES.reduce((acc, stage) => ({
      ...acc,
      [stage.id]: TEST_DEALS.filter(d => d.stage === stage.id)
    }), {})
  )
  const [loading, setLoading] = useState(false)
  const [showDealForm, setShowDealForm] = useState(false)
  const [contacts, setContacts] = useState(TEST_CONTACTS)
  const [formData, setFormData] = useState({
    contact_id: '',
    stage_id: '',
    deal_value: '',
    probability: 50,
    expected_close_date: ''
  })

  useEffect(() => {
    requireAuth()
    setUser(getUser())
    loadPipeline()
    loadContacts()
  }, [])

  const loadContacts = async () => {
    try {
      const { data, error } = await supabase
        .from('contacts')
        .select('id, name, email, company')
        .order('name')

      if (error) throw error
      setContacts(data || [])
    } catch (error) {
      console.error('Error loading contacts:', error)
    }
  }

  const loadPipeline = async () => {
    try {
      // Load stages
      const { data: stagesData, error: stagesError } = await supabase
        .from('pipeline_stages')
        .select('*')
        .eq('is_active', true)
        .order('display_order')

      if (stagesError) throw stagesError

      // Load deals with contact info
      const { data: dealsData, error: dealsError } = await supabase
        .from('pipelines')
        .select(`
          *,
          contact:contacts(name, email, company),
          stage:pipeline_stages(name, color)
        `)
        .is('actual_close_date', null)

      if (dealsError) throw dealsError

      // Organize deals by stage
      const dealsByStage = {}
      stagesData.forEach(stage => {
        dealsByStage[stage.id] = dealsData.filter(deal => deal.stage_id === stage.id)
      })

      setStages(stagesData)
      setDeals(dealsByStage)
    } catch (error) {
      console.error('Error loading pipeline:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDragEnd = async (result) => {
    if (!result.destination) return

    const { draggableId, destination } = result
    const newStageId = destination.droppableId

    try {
      const { error } = await supabase
        .from('pipelines')
        .update({ stage_id: newStageId, updated_at: new Date().toISOString() })
        .eq('id', draggableId)

      if (error) throw error
      loadPipeline()
    } catch (error) {
      console.error('Error updating deal:', error)
      alert('Error moving deal')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const { error } = await supabase
        .from('pipelines')
        .insert([formData])

      if (error) throw error

      setShowDealForm(false)
      setFormData({ contact_id: '', stage_id: '', deal_value: '', probability: 50, expected_close_date: '' })
      loadPipeline()
    } catch (error) {
      console.error('Error creating deal:', error)
      alert('Error creating deal')
    }
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-navy-900 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Link href="/crm/dashboard" className="text-gold-400 hover:text-gold-300">← Dashboard</Link>
              <h1 className="text-2xl font-bold">Sales Pipeline</h1>
            </div>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setShowDealForm(!showDealForm)}
                className="px-4 py-2 bg-gold-500 hover:bg-gold-600 rounded-lg"
              >
                + New Deal
              </button>
              <button onClick={logout} className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg">
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {showDealForm && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h3 className="text-xl font-bold mb-4">New Deal</h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
              <select
                required
                value={formData.contact_id}
                onChange={(e) => setFormData({...formData, contact_id: e.target.value})}
                className="px-4 py-2 border rounded-lg"
              >
                <option value="">Select Contact *</option>
                {contacts.map(contact => (
                  <option key={contact.id} value={contact.id}>
                    {contact.name} - {contact.company}
                  </option>
                ))}
              </select>
              
              <select
                required
                value={formData.stage_id}
                onChange={(e) => setFormData({...formData, stage_id: e.target.value})}
                className="px-4 py-2 border rounded-lg"
              >
                <option value="">Select Stage *</option>
                {stages.map(stage => (
                  <option key={stage.id} value={stage.id}>{stage.name}</option>
                ))}
              </select>

              <input
                type="number"
                placeholder="Deal Value ($) *"
                required
                value={formData.deal_value}
                onChange={(e) => setFormData({...formData, deal_value: e.target.value})}
                className="px-4 py-2 border rounded-lg"
              />

              <input
                type="number"
                placeholder="Probability (%) *"
                min="0"
                max="100"
                required
                value={formData.probability}
                onChange={(e) => setFormData({...formData, probability: e.target.value})}
                className="px-4 py-2 border rounded-lg"
              />

              <input
                type="date"
                value={formData.expected_close_date}
                onChange={(e) => setFormData({...formData, expected_close_date: e.target.value})}
                className="px-4 py-2 border rounded-lg"
              />

              <div className="flex gap-2">
                <button type="submit" className="px-6 py-2 bg-navy-900 text-white rounded-lg hover:bg-navy-800">
                  Create Deal
                </button>
                <button type="button" onClick={() => setShowDealForm(false)} className="px-6 py-2 bg-slate-300 rounded-lg hover:bg-slate-400">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">Loading pipeline...</div>
        ) : (
          <DragDropContext onDragEnd={handleDragEnd}>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 overflow-x-auto">
              {stages.map((stage) => (
                <div key={stage.id} className="bg-white rounded-xl shadow-lg p-4 min-w-[280px]">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-lg" style={{ color: stage.color }}>
                      {stage.name}
                    </h3>
                    <span className="bg-slate-100 px-2 py-1 rounded-full text-sm">
                      {deals[stage.id]?.length || 0}
                    </span>
                  </div>

                  <Droppable droppableId={stage.id}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`space-y-3 min-h-[400px] ${
                          snapshot.isDraggingOver ? 'bg-slate-50' : ''
                        }`}
                      >
                        {deals[stage.id]?.map((deal, index) => (
                          <Draggable key={deal.id} draggableId={deal.id} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`p-4 border-2 rounded-lg bg-white cursor-move hover:shadow-md transition-shadow ${
                                  snapshot.isDragging ? 'shadow-lg border-gold-400' : 'border-slate-200'
                                }`}
                              >
                                <div className="font-medium text-navy-900 mb-1">
                                  {deal.contact?.name}
                                </div>
                                <div className="text-sm text-slate-600 mb-2">
                                  {deal.contact?.company}
                                </div>
                                <div className="text-lg font-bold text-green-600 mb-2">
                                  ${parseFloat(deal.deal_value || 0).toLocaleString()}
                                </div>
                                <div className="flex items-center justify-between text-xs text-slate-500">
                                  <span>{deal.probability}% likely</span>
                                  {deal.expected_close_date && (
                                    <span>{new Date(deal.expected_close_date).toLocaleDateString()}</span>
                                  )}
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              ))}
            </div>
          </DragDropContext>
        )}
      </div>
    </div>
  )
}
