import React, { useState, useEffect } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { supabase } from '@/lib/supabase'

export default function Pipeline() {
  const [stages, setStages] = useState([])
  const [deals, setDeals] = useState({})

  useEffect(() => {
    loadPipelineData()
  }, [])

  const loadPipelineData = async () => {
    // Load pipeline stages
    const { data: stagesData } = await supabase
      .from('pipeline_stages')
      .select('*')
      .eq('is_active', true)
      .order('display_order')

    // Load deals grouped by stage
    const { data: dealsData } = await supabase
      .from('pipelines')
      .select('*, contacts(*), pipeline_stages(*)')

    const groupedDeals = {}
    stagesData?.forEach((stage) => {
      groupedDeals[stage.id] = dealsData?.filter((d) => d.stage_id === stage.id) || []
    })

    setStages(stagesData || [])
    setDeals(groupedDeals)
  }

  const onDragEnd = async (result) => {
    if (!result.destination) return

    const { source, destination, draggableId } = result

    if (source.droppableId === destination.droppableId) return

    // Update deal stage in database
    await supabase
      .from('pipelines')
      .update({ stage_id: destination.droppableId })
      .eq('id', draggableId)

    // Reload data
    loadPipelineData()
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-full mx-auto">
        <h1 className="text-3xl font-bold text-navy-700 mb-8">Sales Pipeline</h1>

        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex space-x-4 overflow-x-auto pb-4">
            {stages.map((stage) => (
              <Droppable key={stage.id} droppableId={stage.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="flex-shrink-0 w-80"
                  >
                    <div className="card bg-white">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-navy-700">{stage.name}</h3>
                        <span className="bg-navy-100 text-navy-700 px-2 py-1 rounded-full text-sm">
                          {deals[stage.id]?.length || 0}
                        </span>
                      </div>

                      <div className="space-y-3 min-h-[200px]">
                        {deals[stage.id]?.map((deal, index) => (
                          <Draggable key={deal.id} draggableId={deal.id} index={index}>
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className="bg-slate-50 p-4 rounded-lg border-2 border-slate-200 hover:border-navy-500 cursor-move"
                              >
                                <h4 className="font-semibold text-navy-700 mb-1">
                                  {deal.contacts?.name}
                                </h4>
                                <p className="text-sm text-slate-600 mb-2">
                                  {deal.contacts?.company || 'No company'}
                                </p>
                                <div className="flex items-center justify-between text-xs">
                                  <span className="text-green-600 font-semibold">
                                    ${deal.deal_value?.toLocaleString() || '0'}
                                  </span>
                                  <span className="text-slate-500">
                                    {deal.probability}% prob
                                  </span>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    </div>
                  </div>
                )}
              </Droppable>
            ))}
          </div>
        </DragDropContext>
      </div>
    </div>
  )
}
