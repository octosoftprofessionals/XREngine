import InvitesConsole from '@xrengine/client-core/src/admin/components/Invite/index'
import { doLoginAuto } from '@xrengine/client-core/src/user/reducers/auth/service'
import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'

interface Props {
  doLoginAuto?: any
}

const mapStateToProps = (state: any): any => {
  return {}
}

const mapDispatchToProps = (dispatch: Dispatch): any => ({
  doLoginAuto: bindActionCreators(doLoginAuto, dispatch)
})

function Groups(props: Props) {
  const { doLoginAuto } = props
  useEffect(() => {
    doLoginAuto(true)
  }, [])
  return <InvitesConsole />
}

export default connect(mapStateToProps, mapDispatchToProps)(Groups)
