import { React, useState} from 'react'
import { useParams } from 'react-router-dom';
import ConnectivityDisplay from '../components/ConnectivityDisplay/ConnectivityDisplay'
import Headline from '../components/Headline'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { solid } from '@fortawesome/fontawesome-svg-core/import.macro'

export default function DeviceInformation() {

  const { id } =  useParams();
  const [log, setLog] = useState({deviceLog: []});

  window.devices.getMessageLog(id).then((log) => {
    setLog({deviceLog: log})
  })

  return (
    <div>
        <Headline text={"Device Name"}>
          <ConnectivityDisplay/>
        </Headline>
        
        <div className='p-5 font-semibold flex flex-col space-y-10'>
          {/* Recent Activity */}
          <div className="grid grid-cols-2 gap-3 content-start text-center text-white">
            <div className='bg-purple-500 p-4 rounded'>Last Active: (Date)</div>
            <div className='bg-purple-500 p-4 rounded'>Last Action: (Action)</div>
            <div className='bg-purple-500 p-4 rounded'>Other Statistic</div>
            <div className='bg-purple-500 p-4 rounded'>More Data</div>
            <div className='bg-purple-500 p-4 rounded'>AAAA</div>
            <div className='bg-purple-500 p-4 rounded'>SO MUCH DATA</div>
            <div className='bg-purple-500 p-4 rounded'>THERE IS EVEN MORE</div>
          </div>

          {/* Log */}
          <div className='font-semibold flex flex-col space-y-3 text-white'>
          {
            log.deviceLog.slice().reverse().map((message, index) => {
              try {
                return (
                  <div className={`w-[100%] ${message.type === "recieved" ? "bg-purple-800" : "bg-purple-600"} p-4 rounded flex flex-row `} key={index}>
                    <div className='flex flex-row space-x-5'>
                      {message.type === "recieved" ? <FontAwesomeIcon icon={solid("download")} /> : <FontAwesomeIcon icon={solid("upload")} />}
                      <p>{message.pluginName}</p>
                      <p>{JSON.stringify(message.message.message)}</p>
                      <p>{new Date(message.timestamp).toISOString().replace(/T/, ' ').replace(/\..+/, '')}</p>
                    </div>
                  </div>
                )
              } catch (e) {
                return (
                  <div className={`w-[100%] bg-orange-400 p-4 rounded flex flex-row `} key={index}>
                    <div className='pr-5'>
                      {message.type === "recieved" ? <FontAwesomeIcon icon={solid("download")} /> : <FontAwesomeIcon icon={solid("upload")} />}
                    </div>
                    <p>{JSON.stringify(message.message)}</p>
                  </div>
                )
              }
            })
          }
          </div>
        </div>
        {/*
            - Activity
            - Available Actions
            - Configure Device in Application
        */}
    </div>
  )
}
